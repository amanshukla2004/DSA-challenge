module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const query = `
    query questionOfToday {
      activeDailyCodingChallengeQuestion {
        date
        link
        question {
          title
          titleSlug
          difficulty
          topicTags {
            name
          }
        }
      }
    }
  `;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    const lcRes = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'Origin': 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({ query })
    });
    clearTimeout(timer);

    if (lcRes.ok) {
      const json = await lcRes.json();
      const daily = json?.data?.activeDailyCodingChallengeQuestion;
      if (daily?.question?.title) {
        res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
        return res.status(200).json(daily);
      }
    }
  } catch (_) {}

  // Fallback to alfa-leetcode-api server-side if LeetCode GraphQL blocks request
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);
    const fallbackRes = await fetch('https://alfa-leetcode-api.onrender.com/daily', {
      signal: controller.signal
    });
    clearTimeout(timer);
    if (fallbackRes.ok) {
      const data = await fallbackRes.json();
      res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
      return res.status(200).json(data);
    }
  } catch (_) {}

  return res.status(502).json({ error: 'Unable to fetch LeetCode POTD upstream' });
};

