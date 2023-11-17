import { json, type DataFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react'
import { db } from '#app/utils/db.server.ts'
import { invariantResponse } from '#app/utils/misc.tsx'

export async function loader({ params }: DataFunctionArgs) {
	const user = db.user.findFirst({
		where: {
			username: { equals: params.username },
		},
	})

	invariantResponse(user, 'User not found', { status: 404 })

	return json({ user: { name: user.name, username: user.username } })
}

export default function ProfileRoute() {
	const data = useLoaderData<typeof loader>()

	return (
		<div className="container mb-48 mt-36 border-4 border-green-500">
			<h1 className="text-h1">{data.user.name ?? data.user.username}</h1>
			<Link to="notes" prefetch="intent" className="underline">
				Notes
			</Link>
		</div>
	)
}

export const meta: MetaFunction = () => {
	return [
		{ title: 'Profile | Epic Notes' },
		{ name: 'description', content: 'Checkout this Profile on Epic Notes' },
	]
}
