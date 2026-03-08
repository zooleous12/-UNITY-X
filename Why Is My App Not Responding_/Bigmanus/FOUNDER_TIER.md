# 🏆 Core Users & Beta Testing Program

## Overview
**Lecture Me** offers exclusive lifetime benefits to early adopters and beta testers.

## Tier Structure

### 🏆 Core Users (First 10) - FREE FOR LIFE
**Design Team / Founding Members**

#### Reserved Seats (1-5)
1. Seat 1 - Reserved (Family)
2. Seat 2 - Reserved (Family)
3. Seat 3 - Reserved (Family)
4. Seat 4 - Reserved (Family)
5. Seat 5 - Reserved (Family)

#### Public Seats (6-10)
6. Seat 6 - Available
7. Seat 7 - Available
8. Seat 8 - Available
9. Seat 9 - Available
10. Seat 10 - Available

**Benefits:**
- ✅ **FREE FOR LIFE** - No subscription fees, ever
- ✅ **Design Team Role** - Help shape product direction
- ✅ **All features unlocked** - Academic tier ($39/month value)
- ✅ **Unlimited processing** - No usage limits
- ✅ **Priority support** - Direct founder access
- ✅ **Exclusive "Core User #X" badge**

---

### 🧪 Beta Testers (Users 11-30) - 1 YEAR FREE
**Beta Testing Team**

20 seats available for beta testers who join early.

**During Beta Period (Until 1000 users):**
- Pay regular subscription ($9-$39/month)
- Get beta testing badge
- Early access to new features
- Bug reporting priority

**After Beta Ends (At 1000 users reached):**
- 🎁 **1 YEAR FREE** subscription unlocked
- Full Academic tier access ($468 value)
- "Beta Tester" badge
- Free year starts from beta completion date

**Beta Tester Benefits:**
- ✅ 12 months free (after beta ends)
- ✅ Beta Tester badge + recognition
- ✅ Influence product development
- ✅ Priority feature requests
- ✅ Special Discord/Slack channel

---

### 📊 Beta Completion Milestone
**Beta Ends:** When user #1000 signs up
- Users 1-10: Core Users continue free forever
- Users 11-30: Unlock 1 year free subscription
- Users 31-1000: Regular pricing continues
- Users 1001+: Official launch pricing

## Marketing Copy

### Landing Page - Core Users
```
🏆 Join the Design Team - Only 5 Spots Left!

Be one of the first 10 Core Users. Get LIFETIME FREE ACCESS.
Help design the future of AI-powered learning.

✅ Free forever • No subscriptions ever
✅ Design Team privileges
✅ All features unlocked
✅ Core User badge #6-10

[Claim Your Seat →]
```

### Landing Page - Beta Testers

```
🧪 Beta Tester Program - 20 Spots Available

Users 11-30 get 1 FREE YEAR after beta completion!
(Pay regular price during beta, unlock free year at 1000 users)

✅ 12 months free ($468 value)
✅ Beta Tester badge
✅ Shape product features
✅ Early access to updates

Beta ends at 1000 users • Currently: [X] users

[Join Beta Testing →]
```

## Database Schema

```json
{
  "user_tiers": {
    "core_users": {
      "1-5": "reserved_family",
      "6-10": "public_founders"
    },
    "beta_testers": {
      "11-30": "beta_tester_1yr_free"
    },
    "regular_users": {
      "31-1000": "beta_period",
      "1001+": "post_launch"
    }
  },
  "beta_status": {
    "current_users": 45,
    "beta_complete": false,
    "completion_date": null,
    "milestone_users": 1000
  },
  "founder_users": {
    "1": {
      "email": "family1@example.com",
      "seat_number": 1,
      "seat_type": "reserved",
      "tier": "FOUNDER_CORE",
      "joined": "2026-01-05T00:00:00Z",
      "lifetime_free": true
    }
  },
  "beta_testers": {
    "11": {
      "email": "beta1@example.com",
      "seat_number": 11,
      "tier": "BETA_TESTER",
      "joined": "2026-01-06T00:00:00Z",
      "free_year_unlocked": false,
      "free_year_start": null
    }
  }
}
```