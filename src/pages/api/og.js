import { ImageResponse } from '@vercel/og'

export const config = { runtime: 'edge' }

const BRAND_BLUE = '#0092c7'
const DARK_BG = '#1a1a1a'

async function loadFont() {
	const response = await fetch(
		'https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@700&display=swap',
	)
	const css = await response.text()
	const fontURL = css.match(/src: url\((.+?)\)/)?.[1]

	if (!fontURL) {
		return null
	}

	const fontResponse = await fetch(fontURL)
	return fontResponse.arrayBuffer()
}

export default async function handler(request) {
	const { searchParams } = new URL(request.url)
	const title = searchParams.get('title') || 'trezy.codes'
	const image = searchParams.get('image')

	const fontData = await loadFont()

	return new ImageResponse(
		(
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'flex-end',
					width: '100%',
					height: '100%',
					backgroundColor: DARK_BG,
					padding: '60px',
					position: 'relative',
				}}>
				{image && (
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							backgroundImage: `url(${image})`,
							backgroundSize: 'cover',
							backgroundPosition: 'center',
						}} />
				)}

				{image && (
					<div
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
						}} />
				)}

				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'flex-end',
						flexGrow: 1,
						position: 'relative',
					}}>
					<div
						style={{
							fontSize: title.length > 60 ? 42 : 56,
							fontFamily: fontData ? '"Libre Franklin"' : 'sans-serif',
							fontWeight: 700,
							color: 'white',
							lineHeight: 1.2,
							marginBottom: '30px',
							wordBreak: 'break-word',
						}}>
						{title}
					</div>
				</div>

				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						position: 'relative',
					}}>
					<div
						style={{
							fontSize: 28,
							fontFamily: fontData ? '"Libre Franklin"' : 'sans-serif',
							fontWeight: 700,
							color: BRAND_BLUE,
						}}>
						{'trezy.codes'}
					</div>
				</div>
			</div>
		),
		{
			width: 1200,
			height: 630,
			fonts: fontData
				? [
					{
						name: 'Libre Franklin',
						data: fontData,
						style: 'normal',
						weight: 700,
					},
				]
				: [],
		},
	)
}
