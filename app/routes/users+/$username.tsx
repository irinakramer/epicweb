import { json, type DataFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { db } from '#app/utils/db.server.ts'
import { invariantResponse } from '#app/utils/misc.tsx'

export async function loader({ params }: DataFunctionArgs) {
	// throw new Error('🐨 Loader error')
	const user = db.user.findFirst({
		where: {
			username: { equals: params.username },
		},
	})

	invariantResponse(user, 'User not found', { status: 404 })

	return json({ user: { name: user.name, username: user.username } })
}

export default function ProfileRoute() {
	// throw new Error('🐨 Component error')
	const data = useLoaderData<typeof loader>()

	return (
		<div className="container mb-48 mt-36">
			<h1 className="text-h1">{data.user.name ?? data.user.username}</h1>
			<Link to="notes" prefetch="intent" className="underline">
				Notes
			</Link>
		</div>
	)
}

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
	const displayName = data?.user.name ?? params.username
	return [
		{ title: `${displayName} | Epic Notes` },
		{
			name: 'description',
			content: `Profile of ${displayName} on Epic Notes`,
		},
	]
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No user with the username "{params.username}" exists</p>
				),
			}}
		/>
	)
}
