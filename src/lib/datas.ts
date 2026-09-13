export function formatarDataEvento(iso: string): string {
  const data = new Date(iso);
  const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(data);
  const horaFormatada = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(data);
  return `${dataFormatada} às ${horaFormatada}`;
}

export function formatarDataCurta(iso: string): string {
  const data = new Date(iso);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(data);
}

export function eventoEhFuturo(iso: string): boolean {
  return new Date(iso).getTime() >= Date.now();
}

export function separarEventos<T extends { data: string }>(
  eventos: T[],
): { proximos: T[]; passados: T[] } {
  const proximos: T[] = [];
  const passados: T[] = [];
  for (const evento of eventos) {
    if (eventoEhFuturo(evento.data)) {
      proximos.push(evento);
    } else {
      passados.push(evento);
    }
  }
  proximos.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
  passados.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  return { proximos, passados };
}
