import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { register } from "@/features/auth/auth.service";
import type { RegisterDto } from "@/features/auth/auth.types";
import { COOKIE_NAME, TEN_YEARS_IN_SECONDS, BUCKET, buildPublicUrl, createSupabaseClient } from "@/lib/config";

function badRequest(error: string, status = 400) {
    return NextResponse.json({ error }, { status });
}

function parseJsonField(field: FormDataEntryValue | null): unknown | null {
    if (!field) return null;

    if (typeof field === "string") return JSON.parse(field);

    if (typeof (field as any)?.text === "function") {
        return (field as File).text().then(JSON.parse);
    }

    return null;
}

async function uploadToSupabase(file: File): Promise<string> {
    const supabase = createSupabaseClient();

    const filename = file.name || `profile-${Date.now()}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const path = `${Date.now()}_${filename}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
    });

    if (error) throw new Error(error.message);

    return path;
}

function validatePayload(payload: any) {
    const missing: string[] = [];
    const allowedSkinTypes = ["OILY", "DRY", "COMBINATION", "SENSITIVE", "NORMAL"];

    if (!payload.nickname?.trim()) missing.push("nickname");
    if (!payload.birth_year || Number.isNaN(payload.birth_year)) missing.push("birth_year");
    if (!allowedSkinTypes.includes(payload.skin_type)) missing.push("skin_type");
    if (!payload.profile_image) missing.push("profile_image");
    if (!Array.isArray(payload.skin_concern_ids) || payload.skin_concern_ids.length === 0) missing.push("skin_concern_ids");
    if (!Array.isArray(payload.onboarding_answers) || payload.onboarding_answers.length === 0) missing.push("onboarding_answers");

    if (missing.length) {
        return `Missing or invalid fields: ${missing.join(", ")}`;
    }

    const invalidAnswers = payload.onboarding_answers.some((a: any) => typeof a.questionId !== "number" || typeof a.answer !== "string");
    if (invalidAnswers) {
        return "onboarding_answers must be [{ questionId: number, answer: string }]";
    }

    const currentYear = new Date().getFullYear();
    if (payload.birth_year < 1798 || payload.birth_year >= currentYear) {
        return `birth_year must be between 1798 and ${currentYear - 1}`;
    }

    return null;
}

export async function POST(req: Request) {
    try {
        const contentType = req.headers.get("content-type") || "";
        if (!contentType.includes("multipart/form-data")) {
            return badRequest("Content-Type must be multipart/form-data");
        }

        const form = await req.formData();

        // Parse core fields
        const nickname = form.get("nickname") as string | null;
        const birthYearRaw = form.get("birth_year");
        const skinType = form.get("skin_type") as string | null;
        const file = form.get("profile_image") as File | null;

        if (!file) return badRequest("profile_image is required");

        // Parse JSON fields
        const skinConcernIds = await parseJsonField(form.get("skin_concern_ids"));
        const onboardingAnswers = await parseJsonField(form.get("onboarding_answers"));

        // Upload image
        const profileImage = await uploadToSupabase(file);

        // Construct payload
        const payload: RegisterDto = {
            nickname: nickname!,
            birth_year: birthYearRaw ? Number(birthYearRaw) : undefined,
            skin_type: skinType as RegisterDto["skin_type"],
            skin_concern_ids: skinConcernIds as number[],
            onboarding_answers: onboardingAnswers as any[],
            profile_image: buildPublicUrl(profileImage),
        };

        // Validate
        const validationError = validatePayload(payload);
        if (validationError) return badRequest(validationError);

        // Create user via service
        const { user, token } = await register(payload);

        // Generate cookie
        const cookie = serialize(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: TEN_YEARS_IN_SECONDS,
        });

        const res = NextResponse.json(
            {
                status: "success",
                message: "User created successfully.",
                data: { user },
            },
            { status: 201 }
        );

        res.headers.set("Set-Cookie", cookie);

        return res;
    } catch (err: any) {
        return badRequest(err?.message ?? "Internal error");
    }
}
