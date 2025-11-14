import { NextResponse } from 'next/server';
import { lighthouse } from 'services/lighthouse.services';

function isValidHref(href) {
  try {
    new URL(href);
    return true;
  } catch {
    return false;
  }
}

async function runLighthouseAudit(href, categories, strategies) {
  const output = {};

  for (const strategy of strategies) {
    output[strategy] = {};

    for (const category of categories) {
      try {
        const { score, audits } = await lighthouse(href, category, strategy);

        output[strategy][category] = {
          score,
          audits,
        };
      } catch (error) {
        console.error(`Error analyzing ${href} for ${strategy}/${category}:`, error);
        output[strategy][category] = { error: error.message };
      }
    }
  }

  return output;
}

export async function POST(req) {
  const body = await req.json();
  const { href, categories = ['PERFORMANCE'], strategies = ['DESKTOP'] } = body;

  if (!href || typeof href !== 'string') {
    return NextResponse.json({ success: false, error: 'href is required' }, { status: 400 });
  }

  if (!isValidHref(href)) {
    return NextResponse.json({ success: false, error: 'Invalid href format' }, { status: 400 });
  }

  try {
    const data = await runLighthouseAudit(href, categories, strategies);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('PageSpeed API error:', error.message);
    const statusCode = error.status || 500;
    const clientMessage =
      statusCode >= 500
        ? 'Internal Server Error during PageSpeed analysis.'
        : error.message;

    return NextResponse.json({ success: false, error: clientMessage }, { status: statusCode });
  }
}
