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

The latest OWASP Top 10, released as the **2025 edition**, keeps Broken Access Control at **A01**, making it the highest-ranked web application security risk. OWASP's data indicates that 3.73% of tested applications had at least one weakness mapped to this category.

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

## A real-world testing workflow

This is where access-control testing becomes much more useful than a collection of random Burp Suite clicks.

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

Keep the accounts separate.

Do not test against another customer's real account. Apart from being unethical, it tends to make reports unnecessarily exciting.

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

You do not need to test every request equally.

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
order_id
invoice_id
project_id
document_id
tenant_id
file_id
```

Also inspect identifiers inside:

- JSON bodies
- URL paths
- query parameters
- GraphQL variables
- cookies
- custom headers

For example:

```http
GET /api/orders/1001
```

or:

```json
{
  "order_id": 1001,
  "user_id": 42
}
```

### Step 4: Establish the baseline

Before modifying anything, send the legitimate request from User A.

For example:

```http
GET /api/orders/1001
Authorization: Bearer USER_A_TOKEN
```

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

Now switch only the object identifier:

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

Typical expected behavior:

```text
403 Forbidden
```

or, depending on the application, a controlled `404 Not Found`.

A vulnerability exists when User A receives User B's resource despite having no legitimate access.

### Step 6: Test write operations

Do not stop after finding readable objects.

Repeat the same methodology for:

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

For destructive operations, use dedicated test objects created specifically for the assessment.

### Step 7: Perform a vertical authorization test

Now compare privileges between User A and Admin.

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

For multi-tenant applications, repeat the same process across organizations.

Example:

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

Checking only the user's identity is not enough.

### Step 9: Test alternative API paths

A common mistake is testing only the obvious web endpoint.

Try to determine whether the same object is exposed through:

```text
Web API
Mobile API
GraphQL
Internal API
Export endpoint
Download endpoint
Search endpoint
```

For example:

```text
/api/orders/1002
/api/mobile/orders/1002
/graphql
/api/orders/export?id=1002
```

A resource that is protected in one interface may be exposed through another.

### Step 10: Test HTTP method differences

Sometimes authorization is implemented for one method but forgotten for another.

Compare:

```http
GET /api/users/1043
```

with:

```http
PATCH /api/users/1043
```

and:

```http
DELETE /api/users/1043
```

The important question is not whether every method exists.

It is whether every sensitive operation enforces the correct policy.

### Step 11: Verify the impact safely

Once you suspect a vulnerability, prove it with the smallest possible action.

For data access:

```text
Access one controlled object belonging to User B.
```

For modification:

```text
Change a harmless test field.
```

For deletion:

```text
Use a disposable test resource.
```

Avoid turning a vulnerability report into an incident report.

### Step 12: Document the finding

A useful report should contain:

```text
Title:
Broken Object-Level Authorization in /api/orders/{id}

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

The latter technically communicates information, in the same way a smoke alarm technically communicates information while the house burns down.

## A practical Burp Suite workflow

A very simple workflow is:

```text
Browser
   ↓
Burp Proxy
   ↓
Capture request as User A
   ↓
Send to Repeater
   ↓
Change object ID
   ↓
Replay with User A session
   ↓
Compare response
   ↓
Repeat with User B / Admin
```

For larger assessments, create a small matrix of endpoints and authorization states:

| Endpoint | User A own | User A → User B | User → Admin | Admin |
|---|---:|---:|---:|---:|
| `/api/profile/1` | ✅ | ❌ | ✅ | ✅ |
| `/api/orders/1` | ✅ | ❌ | ✅ | ✅ |
| `/api/orders/1` PATCH | ✅ | ❌ | ✅ | ✅ |
| `/api/admin/users` | ❌ | ❌ | ✅ | ✅ |

This makes gaps much easier to spot.

## Don't rely on 403 responses alone

A status code is useful, but it is not the vulnerability decision.

These responses can still be dangerous:

```text
200 OK
206 Partial Content
304 Not Modified
```

Likewise, a `404` does not automatically mean the object is protected.

Inspect the actual response.

A request might return:

```json
{
  "id": 1002,
  "email": "victim@example.com",
  "phone": "+..."
}
```

while claiming everything is fine with a `200`.

HTTP status codes are clues, not magical security certificates.

## Testing modern applications

For modern systems, extend the workflow beyond classic IDOR testing.

### GraphQL

Test:

```graphql
query {
    user(id: 1043) {
        email
        orders {
            id
        }
    }
}
```

Check whether individual resolvers enforce authorization.

### JWT-based applications

Do not assume that having a valid JWT means the application will correctly enforce authorization.

Check how claims such as:

```text
role
user_id
tenant_id
scope
```

are actually enforced server-side.

The important test is not "can I manipulate the token?"

It is:

**Does changing authorization-relevant state result in an unauthorized action being accepted?**

### Mass assignment

Look for APIs that accept entire objects:

```json
{
  "name": "Alice",
  "role": "admin",
  "is_verified": true
}
```

If the server blindly maps client-controlled fields into privileged properties, authorization can fail even without a classic IDOR.

## A compact methodology

For real engagements, the workflow can be reduced to:

```text
1. Create controlled identities
2. Map sensitive endpoints
3. Identify object references
4. Capture legitimate requests
5. Test User A → User B
6. Test User → Admin
7. Test read + write + delete
8. Test tenant boundaries
9. Test alternate APIs
10. Verify impact safely
11. Document evidence
12. Recommend server-side authorization controls
```

The key idea is simple:

**Change the identity, change the object, change the action, and observe whether the server still enforces the intended policy.**

That turns access-control testing from random parameter tampering into a repeatable methodology.

## How developers should prevent it

The most reliable rule is simple:

**Every sensitive server-side action must perform an authorization check.**

Not just the frontend.

Not just the API gateway.

Not just the middleware.

The service handling the operation should know whether the current identity is allowed to perform it.

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

Do not treat access-control testing as a single "IDOR check."

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

The uncomfortable lesson is also the useful one:

**Authentication tells you who someone is. Authorization determines what they are allowed to do.**

Confusing the two has kept security researchers employed for decades. Humanity's consistency is almost touching.