# Security Policy

## Reporting Security Vulnerabilities

**Do NOT open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability in Varosity, please report it privately by emailing security@varosity.ai.

**Please include:**
- Description of the vulnerability
- Affected component(s) or file(s)
- Steps to reproduce (if possible)
- Potential impact
- Your contact information (optional, but helpful)

We will:
1. Acknowledge your report within 24 hours
2. Investigate and determine severity
3. Develop and test a fix
4. Release a patch
5. Credit you (if desired) in the security advisory

## Responsible Disclosure

We ask that you:
- Give us reasonable time to fix the issue before public disclosure (typically 90 days)
- Avoid testing on production systems without permission
- Not publicly disclose the vulnerability until a fix is released
- Not access data beyond what's necessary to confirm the vulnerability

## Security Best Practices

When using Varosity:

### API Key Management
- ✅ Store API keys in environment variables (never hardcode)
- ✅ Rotate keys regularly
- ✅ Use different keys for dev/staging/production
- ✅ Revoke compromised keys immediately

### Environment Variables
```bash
# Good
export VAROSITY_API_KEY=vsk_live_xxxx
npm run example

# Bad
const apiKey = "vsk_live_xxxx";  // Hardcoded!
VAROSITY_API_KEY=vsk_live_xxxx npm run example  # Shows in shell history
```

### Example Code
- Use `.env` files locally (added to `.gitignore`)
- Use `.env.example` as a template (safe to commit)
- Never commit `.env` files
- Use secrets manager for production (AWS Secrets, GitHub Secrets, etc.)

### Webhook Security
If you implement webhooks:
- ✅ Verify webhook signatures before processing
- ✅ Reject unsigned webhooks
- ✅ Use HTTPS only
- ✅ Validate webhook source IP (if possible)
- ✅ Implement rate limiting

Example signature verification:
```typescript
import crypto from "crypto";

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const hash = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  
  return crypto.timingSafeEqual(hash, signature);
}
```

## Known Issues

None currently. Security issues are addressed immediately.

## Support

- 🔒 **Report**: security@varosity.ai
- 💬 **Questions**: Use GitHub Discussions (mark as private if needed)
- 📖 **Docs**: See [Security Best Practices Guide](https://github.com/varosity-ai/api#security)

---

**Thank you for helping keep Varosity secure.**

*Last updated: May 15, 2026*
