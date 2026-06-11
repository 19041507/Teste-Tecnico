import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ACCESS_COOKIE_NAME } from '@/core/auth/auth-constants'
import { isPublicApiPath } from '@/core/http/api/public-paths'
import { getBackendUrl } from '@/core/http/api/backend-url'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params)
}

async function proxyRequest(
  request: NextRequest,
  { path }: { path: string[] }
) {
  try {
    const token = (await cookies()).get(ACCESS_COOKIE_NAME)?.value
    const publicPath = isPublicApiPath(path)

    if (!token && !publicPath) {
      return NextResponse.json(
        { message: 'Não autenticado.', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    const baseUrl = getBackendUrl()
    const url = new URL(`/${path.join('/')}${request.nextUrl.search}`, baseUrl)

    const headers = new Headers(request.headers)
    headers.delete('host')
    headers.delete('cookie')

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    const hasBody = !['GET', 'HEAD'].includes(request.method)

    const res = await fetch(url, {
      method: request.method,
      headers,
      body: hasBody ? request.body : undefined,
      ...(hasBody && { duplex: 'half' }),
    })
    const contentType = res.headers.get('content-type') ?? ''

    if (!contentType.includes('application/json')) {
      return new NextResponse(res.body, {
        status: res.status,
        headers: res.headers,
      })
    }

    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('[api/backend proxy]', error)
    return NextResponse.json(
      { message: 'Erro ao comunicar com o servidor.' },
      { status: 502 }
    )
  }
}
