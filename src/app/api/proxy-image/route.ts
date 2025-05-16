import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL da imagem não fornecida' },
        { status: 400 }
      );
    }

    // Validar se a URL é válida
    let url: URL;
    try {
      url = new URL(imageUrl);
    } catch (error) {
      return NextResponse.json(
        { error: 'URL inválida' },
        { status: 400 }
      );
    }

    // Validar se é uma URL de imagem permitida
    const allowedDomains = [
      'images.unsplash.com',
      'plus.unsplash.com',
      'cdn.shopify.com',
      'allokershop.com',
      'tnsdomr.com.br',
      'http2.mlstatic.com',
      'tse3.mm.bing.net',
      'sp.yimg.com',
      'acdn-us.mitiendanube.com',
      'img.joomcdn.net',
      'imgnike-a.akamaihd.net',
      'cdn.dooca.store',
      'cdna.lystit.com'
    ];

    if (!allowedDomains.some(domain => url.hostname.endsWith(domain))) {
      return NextResponse.json(
        { error: 'Domínio não permitido' },
        { status: 403 }
      );
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Erro ao buscar imagem' },
        { status: response.status }
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      return NextResponse.json(
        { error: 'URL não é uma imagem válida' },
        { status: 400 }
      );
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Erro no proxy de imagem:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 