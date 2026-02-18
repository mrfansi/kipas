import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/get-db";
import {
	organizations,
	users,
	kpis,
	kpiValues,
	goals,
	goalKpis,
	checkins,
	feedback,
	alerts,
	dataSources,
} from "@/db/schema";

export async function POST() {
	try {
		const db = await getDatabase();

		// === Organization ===
		await db.insert(organizations).values({
			id: "org-001",
			name: "PT Kipas Digital Indonesia",
			slug: "kipas-digital",
			logoUrl: null,
		}).onConflictDoNothing();

		// === Users ===
		const usersData = [
			{ id: "usr-001", email: "ari@kipas.id", name: "Ari Pratama", role: "admin" as const },
			{ id: "usr-002", email: "siti@kipas.id", name: "Siti Nurhaliza", role: "manager" as const },
			{ id: "usr-003", email: "budi@kipas.id", name: "Budi Santoso", role: "member" as const },
			{ id: "usr-004", email: "dewi@kipas.id", name: "Dewi Lestari", role: "member" as const },
			{ id: "usr-005", email: "fajar@kipas.id", name: "Fajar Hidayat", role: "member" as const },
			{ id: "usr-006", email: "rina@kipas.id", name: "Rina Wati", role: "manager" as const },
			{ id: "dev-user-001", email: "dev@kipas.local", name: "Developer", role: "admin" as const },
		];

		for (const u of usersData) {
			await db.insert(users).values({
				...u,
				organizationId: "org-001",
				isActive: true,
				locale: "id",
			}).onConflictDoNothing();
		}

		// === KPIs ===
		const kpisData = [
			{
				id: "kpi-001", name: "Revenue Bulanan", category: "Penjualan",
				unit: "currency", targetValue: 500000000, frequency: "monthly" as const,
				ownerId: "usr-001", weight: 3,
				description: "Total pendapatan bulanan dari semua produk dan layanan",
			},
			{
				id: "kpi-002", name: "Customer Satisfaction Score", category: "Layanan",
				unit: "percentage", targetValue: 90, frequency: "monthly" as const,
				ownerId: "usr-002", weight: 2,
				description: "Tingkat kepuasan pelanggan berdasarkan survei bulanan",
			},
			{
				id: "kpi-003", name: "Employee Retention Rate", category: "SDM",
				unit: "percentage", targetValue: 95, frequency: "quarterly" as const,
				ownerId: "usr-003", weight: 2,
				description: "Persentase karyawan yang bertahan selama periode tertentu",
			},
			{
				id: "kpi-004", name: "Time to Market", category: "Engineering",
				unit: "number", targetValue: 14, frequency: "weekly" as const,
				ownerId: "usr-004", weight: 1,
				description: "Rata-rata hari dari konsep hingga rilis fitur",
			},
			{
				id: "kpi-005", name: "Lead Conversion Rate", category: "Marketing",
				unit: "percentage", targetValue: 25, frequency: "monthly" as const,
				ownerId: "usr-005", weight: 2,
				description: "Persentase lead yang berubah menjadi pelanggan",
			},
			{
				id: "kpi-006", name: "Cost per Acquisition", category: "Marketing",
				unit: "currency", targetValue: 150000, frequency: "monthly" as const,
				ownerId: "usr-006", weight: 1,
				description: "Biaya rata-rata untuk mendapatkan satu pelanggan baru",
			},
			{
				id: "kpi-007", name: "Net Promoter Score", category: "Layanan",
				unit: "number", targetValue: 70, frequency: "quarterly" as const,
				ownerId: "usr-002", weight: 1,
				description: "Skor loyalitas dan kepuasan pelanggan",
			},
		];

		for (const kpi of kpisData) {
			await db.insert(kpis).values({
				...kpi,
				organizationId: "org-001",
				status: kpi.id === "kpi-007" ? "paused" : "active",
			}).onConflictDoNothing();
		}

		// === KPI Values (time series) ===
		const kpiValuesData = [
			// Revenue Bulanan - trending up
			{ kpiId: "kpi-001", value: 320000000, date: "2026-01-15" },
			{ kpiId: "kpi-001", value: 380000000, date: "2026-02-01" },
			{ kpiId: "kpi-001", value: 425000000, date: "2026-02-15" },
			// Customer Satisfaction - stable high
			{ kpiId: "kpi-002", value: 84, date: "2026-01-15" },
			{ kpiId: "kpi-002", value: 86, date: "2026-02-01" },
			{ kpiId: "kpi-002", value: 87, date: "2026-02-15" },
			// Employee Retention - slight decline
			{ kpiId: "kpi-003", value: 92, date: "2025-12-31" },
			{ kpiId: "kpi-003", value: 90, date: "2026-01-31" },
			{ kpiId: "kpi-003", value: 88, date: "2026-02-15" },
			// Time to Market - flat
			{ kpiId: "kpi-004", value: 19, date: "2026-01-20" },
			{ kpiId: "kpi-004", value: 18, date: "2026-02-03" },
			{ kpiId: "kpi-004", value: 18, date: "2026-02-10" },
			// Lead Conversion - trending up
			{ kpiId: "kpi-005", value: 18, date: "2026-01-15" },
			{ kpiId: "kpi-005", value: 20, date: "2026-02-01" },
			{ kpiId: "kpi-005", value: 21, date: "2026-02-15" },
			// Cost per Acquisition - trending down (bad)
			{ kpiId: "kpi-006", value: 160000, date: "2026-01-15" },
			{ kpiId: "kpi-006", value: 170000, date: "2026-02-01" },
			{ kpiId: "kpi-006", value: 180000, date: "2026-02-15" },
			// NPS
			{ kpiId: "kpi-007", value: 62, date: "2025-12-31" },
			{ kpiId: "kpi-007", value: 65, date: "2026-02-15" },
		];

		for (const kv of kpiValuesData) {
			await db.insert(kpiValues).values({
				id: crypto.randomUUID(),
				...kv,
				source: "manual",
				createdBy: "usr-001",
			});
		}

		// === Goals ===
		const goalsData = [
			{
				id: "goal-001", title: "Meningkatkan Revenue 20% di Q1",
				description: "Target peningkatan pendapatan tahunan melalui diversifikasi produk dan ekspansi pasar.",
				status: "in_progress" as const, progress: 65, ownerId: "usr-001",
				dueDate: "2026-03-31", startDate: "2026-01-01",
			},
			{
				id: "goal-002", title: "Kurangi Customer Churn < 5%",
				description: "Menurunkan tingkat kehilangan pelanggan dengan meningkatkan kualitas layanan.",
				status: "at_risk" as const, progress: 40, ownerId: "usr-002",
				dueDate: "2026-06-30", startDate: "2026-01-01",
			},
			{
				id: "goal-003", title: "Launch Fitur Mobile App v2",
				description: "Rilis versi baru aplikasi mobile dengan fitur offline dan notifikasi push.",
				status: "in_progress" as const, progress: 78, ownerId: "usr-004",
				dueDate: "2026-02-28", startDate: "2025-12-01",
			},
			{
				id: "goal-004", title: "Sertifikasi ISO 27001",
				description: "Mendapatkan sertifikasi keamanan informasi ISO 27001.",
				status: "not_started" as const, progress: 0, ownerId: "usr-003",
				dueDate: "2026-09-30", startDate: "2026-04-01",
			},
			{
				id: "goal-005", title: "Onboarding 50 Karyawan Baru",
				description: "Proses rekrutmen dan onboarding untuk mendukung pertumbuhan tim.",
				status: "completed" as const, progress: 100, ownerId: "usr-006",
				dueDate: "2026-01-31", startDate: "2025-10-01",
			},
		];

		for (const goal of goalsData) {
			await db.insert(goals).values({
				...goal,
				organizationId: "org-001",
				completedAt: goal.status === "completed" ? new Date("2026-01-28") : null,
			}).onConflictDoNothing();
		}

		// === Goal-KPI Links ===
		const goalKpisData = [
			{ goalId: "goal-001", kpiId: "kpi-001" },
			{ goalId: "goal-001", kpiId: "kpi-005" },
			{ goalId: "goal-001", kpiId: "kpi-006" },
			{ goalId: "goal-002", kpiId: "kpi-002" },
			{ goalId: "goal-002", kpiId: "kpi-007" },
			{ goalId: "goal-003", kpiId: "kpi-004" },
			{ goalId: "goal-003", kpiId: "kpi-002" },
			{ goalId: "goal-003", kpiId: "kpi-005" },
			{ goalId: "goal-003", kpiId: "kpi-007" },
			{ goalId: "goal-004", kpiId: "kpi-003" },
			{ goalId: "goal-005", kpiId: "kpi-003" },
			{ goalId: "goal-005", kpiId: "kpi-006" },
		];

		for (const gk of goalKpisData) {
			await db.insert(goalKpis).values({
				id: crypto.randomUUID(),
				...gk,
				weight: 1,
			});
		}

		// === Check-ins ===
		const checkinsData = [
			{
				userId: "usr-001", weekStart: "2026-02-10",
				mood: "good" as const,
				accomplishments: "Berhasil menutup 3 deal baru dengan total Rp 150 juta. Menyelesaikan user research untuk fitur baru.",
				blockers: "Menunggu approval dari tim legal untuk kontrak baru.",
				plans: "Follow-up dengan 5 prospek baru. Mulai sprint planning untuk Q2.",
				submittedAt: new Date("2026-02-14"),
			},
			{
				userId: "usr-001", weekStart: "2026-02-03",
				mood: "great" as const,
				accomplishments: "Launch fitur dashboard v2 tanpa bug kritis. NPS naik 5 poin.",
				blockers: "Tidak ada hambatan signifikan.",
				plans: "Mulai development modul reporting. Koordinasi dengan tim marketing untuk campaign.",
				submittedAt: new Date("2026-02-07"),
			},
			{
				userId: "usr-001", weekStart: "2026-01-27",
				mood: "struggling" as const,
				accomplishments: "Selesaikan migrasi database. Patch security vulnerability.",
				blockers: "Server downtime 2 jam mempengaruhi sprint velocity.",
				plans: "Evaluasi infrastruktur. Setup monitoring alerting yang lebih baik.",
				submittedAt: new Date("2026-01-31"),
			},
			{
				userId: "usr-002", weekStart: "2026-02-10",
				mood: "good" as const,
				accomplishments: "Berhasil menyelesaikan 2 program training untuk tim CS.",
				blockers: "Beberapa staf CS kurang responsif terhadap feedback.",
				plans: "Review SOP customer support dan update FAQ.",
				submittedAt: new Date("2026-02-14"),
			},
		];

		for (const ci of checkinsData) {
			await db.insert(checkins).values({
				id: crypto.randomUUID(),
				organizationId: "org-001",
				...ci,
			});
		}

		// === Feedback ===
		const feedbackData = [
			{
				fromUserId: "usr-001", toUserId: "dev-user-001",
				type: "praise" as const,
				content: "Kerja bagus menyelesaikan integrasi API dalam waktu singkat! Tim sangat terbantu dengan kecepatan delivery-nya.",
				isAnonymous: false,
			},
			{
				fromUserId: "usr-003", toUserId: "dev-user-001",
				type: "suggestion" as const,
				content: "Mungkin kita bisa menambahkan daily standup yang lebih singkat, 10 menit saja, agar lebih efisien.",
				isAnonymous: true,
			},
			{
				fromUserId: "usr-004", toUserId: "dev-user-001",
				type: "concern" as const,
				content: "Saya perhatikan workload tim engineering cukup tinggi akhir-akhir ini. Mungkin perlu evaluasi kapasitas sprint.",
				isAnonymous: false,
			},
			{
				fromUserId: "usr-003", toUserId: "dev-user-001",
				type: "praise" as const,
				content: "Presentasi ke klien kemarin sangat impresif! Data yang disajikan sangat detail dan meyakinkan.",
				isAnonymous: false,
			},
		];

		for (const fb of feedbackData) {
			await db.insert(feedback).values({
				id: crypto.randomUUID(),
				organizationId: "org-001",
				...fb,
			});
		}

		// === Alerts ===
		const alertsData = [
			{
				kpiId: "kpi-002", type: "threshold_above" as const,
				severity: "high" as const, thresholdValue: 8,
				message: "Churn rate melebihi batas 8%", isActive: true,
				lastTriggeredAt: new Date("2026-02-17T08:30:00"),
			},
			{
				kpiId: "kpi-001", type: "threshold_below" as const,
				severity: "critical" as const, thresholdValue: 400000000,
				message: "Revenue di bawah Rp 400 juta", isActive: true,
				lastTriggeredAt: null,
			},
			{
				kpiId: "kpi-007", type: "trend_change" as const,
				severity: "medium" as const, thresholdValue: null,
				message: "Perubahan tren NPS yang signifikan", isActive: true,
				lastTriggeredAt: new Date("2026-02-10T14:00:00"),
			},
			{
				kpiId: "kpi-004", type: "no_data" as const,
				severity: "low" as const, thresholdValue: null,
				message: "Tidak ada data selama 7 hari", isActive: false,
				lastTriggeredAt: null,
			},
		];

		for (const alert of alertsData) {
			await db.insert(alerts).values({
				id: crypto.randomUUID(),
				organizationId: "org-001",
				...alert,
			}).onConflictDoNothing();
		}

		// === Data Sources ===
		const dataSourcesData = [
			{
				name: "Laporan Penjualan Harian", type: "csv" as const,
				status: "active" as const, lastSyncAt: new Date("2026-02-18T08:00:00"),
			},
			{
				name: "Google Analytics API", type: "api" as const,
				status: "active" as const, lastSyncAt: new Date("2026-02-18T07:30:00"),
			},
			{
				name: "HR Input Manual", type: "manual" as const,
				status: "active" as const, lastSyncAt: new Date("2026-02-15T10:00:00"),
			},
			{
				name: "CRM Integration", type: "api" as const,
				status: "error" as const, lastSyncAt: new Date("2026-02-14T12:00:00"),
			},
		];

		for (const ds of dataSourcesData) {
			await db.insert(dataSources).values({
				id: crypto.randomUUID(),
				organizationId: "org-001",
				...ds,
			});
		}

		return NextResponse.json({
			success: true,
			message: "Database seeded successfully!",
			summary: {
				organizations: 1,
				users: usersData.length,
				kpis: kpisData.length,
				kpiValues: kpiValuesData.length,
				goals: goalsData.length,
				goalKpis: goalKpisData.length,
				checkins: checkinsData.length,
				feedback: feedbackData.length,
				alerts: alertsData.length,
				dataSources: dataSourcesData.length,
			},
		});
	} catch (error) {
		console.error("Seed error:", error);
		return NextResponse.json(
			{ success: false, error: String(error) },
			{ status: 500 },
		);
	}
}
