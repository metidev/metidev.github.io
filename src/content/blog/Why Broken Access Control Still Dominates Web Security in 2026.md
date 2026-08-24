---
title: Why Broken Access Control Still Dominates Web Security in 2026

date: 2026.08.24

readTime: 10m

tags: [Web Security, Pentesting, OWASP, Access Control]

excerpt: Broken access control remains the #1 web application security risk in OWASP Top 10:2025. This practical guide explains why it keeps appearing, how attackers find it, and how to test it systematically in real applications.
---

Broken access control is one of those security problems that refuses to die.

Developers add authentication, deploy WAFs, rotate secrets, run vulnerability scanners, and proudly announce that the application is "secure." Then someone changes an ID in a request from `123` to `124` and suddenly they are looking at another user's data.

Humanity has apparently decided that authorization is harder than quantum physics.

The latest OWASP Top 10, released as the **2025 edition**, keeps Broken Access Control at **A01**, making it the highest-ranked web application security risk.

This article focuses on how these vulnerabilities actually appear in modern applications and how a pentester can approach them systematically.

## What is Broken Access Control?

Authentication answers:

> "Who are you?"

Authorization answers:

> "What are you allowed to do?"

Broken access control happens when the application fails to correctly enforce the second question.

Consider a simple API:

```http
GET /api/users/1042/profile
Authorization: Bearer eyJ...
```

Imagine the authenticated user is account `1042`.

The application correctly verifies the token, but never checks whether that user is actually allowed to access account `1043`.

Changing the request to:

```http
GET /api/users/1043/profile
Authorization: Bearer eyJ...
```

may return another user's information.

The attacker did not bypass authentication.

They simply asked for something they were never supposed to receive.

That's the important distinction.

## BOLA vs. IDOR: closely related, but not identical

These two terms are often used interchangeably in security discussions, which is understandable because the internet enjoys turning related concepts into vocabulary soup.

They are **not exactly the same thing**.

### BOLA

**BOLA**, or **Broken Object Level Authorization**, describes a failure to enforce authorization when a user accesses a specific object through an API.

For example:

```http
GET /api/invoices/7813
Authorization: Bearer USER_A_TOKEN
```

If invoice `7813` belongs to User B and the API returns it to User A, the core problem is **broken object-level authorization**.

The object might be identified by:

```text
7813
550e8400-e29b-41d4-a716-446655440000
abc123
```

It does not matter whether the identifier is predictable.

The security failure is that the server did not enforce the authorization policy for the requested object.

### IDOR

**IDOR**, or **Insecure Direct Object Reference**, describes a common way this problem is exposed: the application accepts a client-controlled reference to an internal object and fails to properly protect that reference.

For example:

```http
GET /api/invoices/7812
```

becomes:

```http
GET /api/invoices/7813
```

and the server returns an object the user should not see.

The important detail is that the object reference itself is exposed to the client and can be manipulated.

### The easiest way to remember the difference

Think of it like this:

```text
IDOR = the exposed/manipulable object reference
BOLA = the missing authorization check around that object
```

In practice, an IDOR-style attack can result in a BOLA vulnerability.

But **BOLA does not require a classic numeric IDOR pattern**.

For example, suppose the API uses a GraphQL query:

```graphql
query {
    invoice(uuid: "550e8400-e29b-41d4-a716-446655440000") {
        total
        customer
    }
}
```

The UUID may be impossible to guess.

If a user obtains it legitimately and the server still returns another tenant's invoice without checking authorization, the application still has a **BOLA** problem.

Likewise, BOLA can affect actions other than simple object retrieval:

```http
PATCH /api/projects/42
DELETE /api/documents/abc123
POST /api/accounts/7/transfer
```

The common factor is the missing authorization decision for the object being acted upon.

### Practical comparison

 Concept | Main idea | Requires predictable ID? 
 **IDOR** | Client can manipulate a direct object reference | No 
 **BOLA** | Server fails to enforce authorization for a specific object | No 
 **Typical IDOR → BOLA** | Change object reference and access another user's resource | No 

So during a pentest, avoid reporting every object-access bug simply as "IDOR."

A more precise finding might be:

> **Broken Object Level Authorization (BOLA) via an insecure direct object reference**

That tells the developer both **what failed** and **how the failure was exposed**.

## Why does this vulnerability keep happening?

Modern applications are rarely simple.

A single application may contain:

- REST APIs
- GraphQL
- background jobs
- mobile APIs
- internal microservices
- object storage
- admin dashboards
- third-party integrations
- WebSockets

Each component can implement authorization slightly differently.

One endpoint may correctly verify ownership while another assumes that authentication automatically means authorization.

It doesn't.

## The classic IDOR problem

One of the easiest manifestations to understand is **Insecure Direct Object Reference (IDOR)**.

Suppose a website lets users download invoices:

```http
GET /api/invoices/7812/download
```

You own invoice `7812`.

During testing, you change it:

```http
GET /api/invoices/7813/download
```

If the server returns another user's invoice, you have found an authorization flaw.

The important part is not the numeric ID.

The important part is whether the server verifies ownership.

A secure implementation should effectively perform something like:

```python
invoice = get_invoice(invoice_id)

if invoice.owner_id != current_user.id:
    return 403

return download(invoice)
```

The frontend should never be considered a security boundary.

If a button is hidden in JavaScript, that does not mean the operation is protected.

The attacker can simply send the request manually.

## Horizontal vs. vertical privilege escalation

Access-control vulnerabilities generally fall into two useful categories.

### Horizontal privilege escalation

A normal user accesses another user's resources.

For example:

```text
User A -> /api/orders/1001
User A -> /api/orders/1002
```

If order `1002` belongs to User B and is returned, the application has an authorization failure.

### Vertical privilege escalation

A lower-privileged user accesses functionality intended for a higher-privileged role.

For example:

```http
POST /api/admin/users/disable
```

The application may correctly authenticate the attacker but fail to verify that they have an administrative role.

That can turn a normal account into an administrative foothold.

## A real-world testing workflow

For an authorized assessment, use a repeatable workflow.

### Step 1: Create controlled test accounts

Create at least two normal users:

```text
User A
User B
```

If the application supports roles, create an administrative account as well:

```text
User A → normal user
User B → normal user
Admin  → privileged user
```

Keep the accounts separate and use only resources created for the assessment.

### Step 2: Build an access-control map

Log in as User A and use the application normally.

Capture interesting requests with Burp Suite or another HTTP proxy.

Record endpoints such as:

```text
GET    /api/profile
GET    /api/orders/1001
POST   /api/orders
PATCH  /api/orders/1001
DELETE /api/orders/1001
GET    /api/projects/42
POST   /api/projects/42/members
GET    /api/admin/users
```

Focus on requests that:

- access user-specific data
- modify resources
- delete resources
- change permissions
- expose organization data
- perform administrative actions

### Step 3: Identify object references

Look for parameters that identify resources:

```text
user_id
account_id
customer_id
order_id
invoice_id
document_id
project_id
tenant_id
file_id
```

Also inspect identifiers inside:

- JSON bodies
- URL paths
- query parameters
- GraphQL variables
- custom headers

For example:

```http
GET /api/documents/450
Cookie: session=userA
```

### Step 4: Establish the baseline

Send the legitimate request from User A.

Record:

```text
HTTP status
Response length
Returned object
Object owner
Sensitive fields
```

This becomes your baseline.

### Step 5: Perform a horizontal authorization test

Switch only the object identifier:

```http
GET /api/orders/1002
Authorization: Bearer USER_A_TOKEN
```

Assume:

```text
1001 → owned by User A
1002 → owned by User B
```

A secure application should reject the second request.

A vulnerability exists when User A receives User B's resource despite having no legitimate access.

### Step 6: Test write operations

Repeat the methodology for:

```text
POST
PUT
PATCH
DELETE
```

For example:

```http
PATCH /api/profile/1043
Authorization: Bearer USER_A_TOKEN
Content-Type: application/json

{
  "display_name": "test"
}
```

If `1043` belongs to User B, determine whether User A can modify it.

For destructive operations, use disposable test resources.

### Step 7: Perform a vertical authorization test

Capture an administrative request:

```http
POST /api/admin/users/disable
Authorization: Bearer ADMIN_TOKEN
```

Replay it using User A's session:

```http
POST /api/admin/users/disable
Authorization: Bearer USER_A_TOKEN
```

The server should reject the request.

If a normal user can perform an administrative action, you have a **vertical privilege escalation**.

### Step 8: Test tenant isolation

For multi-tenant applications:

```text
Organization A
└── Project 101

Organization B
└── Project 202
```

Authenticated as a user from Organization A:

```http
GET /api/projects/202
```

The application must verify both:

```text
Is the user authenticated?
Does this object belong to the user's allowed tenant?
```

### Step 9: Test alternative API paths

Determine whether the same object is exposed through:

```text
Web API
Mobile API
GraphQL
Internal API
Export endpoint
Download endpoint
Search endpoint
```

A resource protected in one interface may be exposed through another.

### Step 10: Verify the impact safely

Once you suspect a vulnerability, prove it with the smallest possible action.

For data access, access one controlled object belonging to User B.

For modification, change a harmless test field.

For deletion, use a disposable test resource.

Avoid turning a vulnerability report into an incident report.

### Step 11: Document the finding

A useful report should contain:

```text
Title:
Broken Object Level Authorization in /api/orders/{id}

Affected endpoint:
/api/orders/{id}

Attacker account:
User A

Victim/test account:
User B

Steps to reproduce:
1. Authenticate as User A.
2. Request /api/orders/1001.
3. Change the identifier to 1002.
4. Send the request.
5. Observe that User A receives User B's order.

Expected result:
Access denied.

Actual result:
The application returns the other user's order.

Impact:
Unauthorized access to customer order data.

Remediation:
Enforce server-side object ownership or authorization policy
before returning or modifying the resource.
```

That is far more useful than:

```text
"IDOR found. Please fix."
```

## Don't test only GET requests

Authorization problems also appear in state-changing operations.

Test:

```http
GET
POST
PUT
PATCH
DELETE
```

Even if reading another user's profile is blocked, modifying it may not be.

A missing authorization check on deletion can turn a minor information disclosure into a destructive vulnerability.

## Check indirect identifiers too

Developers sometimes replace numeric IDs with UUIDs:

```text
550e8400-e29b-41d4-a716-446655440000
```

That can make enumeration harder.

It does **not** fix BOLA.

An attacker can still obtain another object's UUID through:

- API responses
- search functionality
- shared links
- notifications
- client-side JavaScript
- GraphQL responses

A random identifier is not an authorization mechanism.

It is merely a harder-to-guess identifier.

## Multi-tenant applications deserve extra attention

SaaS applications are especially interesting because multiple organizations may share the same infrastructure.

A user may be authenticated correctly but still be allowed to access another tenant's data.

Always test authorization at the tenant boundary, not only at the user boundary.

## GraphQL changes the testing strategy

GraphQL applications require a slightly different mindset.

Instead of dozens of predictable REST endpoints, you may have a single endpoint:

```http
POST /graphql
```

with queries such as:

```graphql
query {
    user(id: 1043) {
        email
        phone
        orders {
            id
        }
    }
}
```

The application may enforce authorization on the GraphQL endpoint itself but forget to enforce it on specific resolvers.

This can produce BOLA even when the GraphQL endpoint itself is fully authenticated.

## Watch for hidden authorization assumptions

A common pattern looks like this:

```python
@app.get("/projects/{project_id}")
def get_project(project_id):
    return db.projects.get(project_id)
```

The code assumes that because the route requires a logged-in user, the object is safe to return.

A safer implementation is:

```python
@app.get("/projects/{project_id}")
def get_project(project_id, current_user):
    project = db.projects.get(project_id)

    if not project:
        return 404

    if project.owner_id != current_user.id:
        return 403

    return project
```

The authorization decision must happen where the resource is accessed.

## A practical testing checklist

When testing a new application, think in terms of **identity + object + action**.

For each interesting request, ask:

```text
Who am I?
What object am I accessing?
What action am I performing?
Who owns that object?
What role should be required?
What happens if I change the object identifier?
What happens if I change the HTTP method?
What happens if I remove or modify role-related parameters?
```

A useful matrix looks like this:

Test | User A | User B | Admin 
 Read own object | ✔ | ✔ | ✔ 
 Read another user's object | ✘ | ✘ | ✔
 Modify own object | ✔ | ✔ | ✔ 
 Modify another user's object | ✘ | ✘ | ✔
 Delete another user's object | ✘ | ✘ | ✔
 Access admin function | ✘ | ✘ | ✔

The exact permissions depend on the application.

The point is to make authorization explicit rather than relying on assumptions.

## How developers should prevent it

The most reliable rule is simple:

**Every sensitive server-side action must perform an authorization check.**

Not just the frontend.

Not just the API gateway.

Not just the middleware.

The final service handling the operation should know whether the current identity is allowed to perform it.

A good authorization architecture should therefore use:

```text
Authentication
      ↓
Identity
      ↓
Authorization policy
      ↓
Resource ownership / tenant check
      ↓
Action
```

rather than:

```text
Authentication
      ↓
"User is logged in, so probably fine."
      ↓
Action
```

That second architecture is surprisingly common.

## One final lesson for pentesters

Do not treat access control testing as a single "IDOR check."

Think about it as a map of trust boundaries.

Test:

```text
User → User
User → Admin
Tenant → Tenant
Project → Project
Object → Object
API → API
UI → API
REST → GraphQL
Web → Mobile API
```

The most interesting bugs often live between these boundaries.

The lesson is unpleasant but useful:

**Authentication tells you who someone is. Authorization determines what they are allowed to do.**

And when an application exposes an object reference without enforcing the corresponding authorization policy, that is where the seemingly harmless distinction between **IDOR** and **BOLA** becomes a real security problem.