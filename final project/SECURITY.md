Security Considerations

- Never commit server/.env or any credentials
- Use a secrets manager for production (AWS Secrets Manager, Azure Key Vault, etc.)
- Rotate JWT_SECRET and DB credentials periodically
- Limit DB user privileges and whitelist IPs for MongoDB Atlas
