export interface ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// export const changePasswordSchema = z.object({
//     oldPassword: z
//         .string()
//         .nonempty("La contraseña actual es obligatoria."),
//     newPassword: z
//         .string()
//         .nonempty("La nueva contraseña es obligatoria.")
//         .min(8, "La nueva contraseña debe tener al menos 8 caracteres.")
//         .regex(/[A-Z]/, "La nueva contraseña debe contener al menos una letra mayúscula.")
//         .regex(/[a-z]/, "La nueva contraseña debe contener al menos una letra minúscula."),
//     confirmPassword: z
//         .string()
//         .nonempty("La confirmación de la nueva contraseña es obligatoria.")
//         .refine((val: string, ctx: z.RefinementCtx) => val === ctx.parent.newPassword, {
//             message: "La confirmación de la contraseña no coincide con la nueva contraseña.",
//         }),
// });
//
// export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
