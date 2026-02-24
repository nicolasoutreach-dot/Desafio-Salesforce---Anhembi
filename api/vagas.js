export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

    const { SF_LOGIN_URL, SF_CLIENT_ID, SF_CLIENT_SECRET } = process.env;

    if (!SF_CLIENT_ID || !SF_CLIENT_SECRET) {
        return res.status(200).json({ count: 0, limit: 90, available: true });
    }

    try {
        const loginUrl = SF_LOGIN_URL || 'https://login.salesforce.com';
        const tokenRes = await fetch(`${loginUrl}/services/oauth2/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: SF_CLIENT_ID,
                client_secret: SF_CLIENT_SECRET,
            }),
        });

        if (!tokenRes.ok) {
            return res.status(200).json({ count: 0, limit: 90, available: true });
        }

        const { access_token, instance_url } = await tokenRes.json();

        const query = encodeURIComponent(
            "SELECT COUNT(Id) total FROM Lead WHERE LeadSource = 'Desafio Salesforce: Criação de Agentes (IA)'"
        );
        const queryRes = await fetch(
            `${instance_url}/services/data/v59.0/query?q=${query}`,
            { headers: { Authorization: `Bearer ${access_token}` } }
        );

        if (!queryRes.ok) {
            return res.status(200).json({ count: 0, limit: 90, available: true });
        }

        const data = await queryRes.json();
        const count = data.records?.[0]?.total || 0;

        return res.status(200).json({
            count,
            limit: 90,
            available: count < 90,
        });
    } catch {
        return res.status(200).json({ count: 0, limit: 90, available: true });
    }
}
