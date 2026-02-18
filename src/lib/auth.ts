import { headers } from "next/headers";

export interface CFUser {
	email: string;
	name: string;
	id: string;
}

/**
 * Get the authenticated user from Cloudflare Zero Trust headers.
 * In development, returns a mock user.
 */
export async function getCFUser(): Promise<CFUser | null> {
	const headersList = await headers();

	const email = headersList.get("cf-access-authenticated-user-email");

	// Development fallback
	if (!email && process.env.NODE_ENV === "development") {
		return {
			email: "dev@kipas.local",
			name: "Developer",
			id: "dev-user-001",
		};
	}

	if (!email) return null;

	// Extract name from email (before @)
	const name = email.split("@")[0]
		.split(".")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");

	return {
		email,
		name,
		id: `cf-${Buffer.from(email).toString("base64url")}`,
	};
}

/**
 * Validate the CF Access JWT token (optional, for extra security).
 */
export async function validateCFAccessToken(): Promise<boolean> {
	const headersList = await headers();
	const token = headersList.get("cf-access-jwt-assertion");

	if (!token && process.env.NODE_ENV === "development") return true;
	if (!token) return false;

	// In production, validate the JWT against your CF Access policy
	// https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/validating-json/
	return true;
}
