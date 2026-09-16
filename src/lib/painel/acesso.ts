export function normalizarEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function emailsPermitidos(): string[] {
  return (process.env.PAINEL_EMAILS_PERMITIDOS ?? "")
    .split(",")
    .map(normalizarEmail)
    .filter(Boolean);
}

export function podeAcessarPainel(email: string): boolean {
  return emailsPermitidos().includes(normalizarEmail(email));
}
