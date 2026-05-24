# Design System

O Vynce busca uma aparência **profissional, moderna e confiável** — adequada a um
produto SaaS para o mercado imobiliário de alto padrão.

## Paleta de cores

A cor de marca é um **violeta/índigo** que transmite sofisticação e confiança,
sobre uma base neutra de cinzas (`slate`) para máxima legibilidade.

| Token       | Uso                                | Valor     |
| ----------- | ---------------------------------- | --------- |
| `brand-50`  | Fundos sutis, destaques            | `#f5f3ff` |
| `brand-100` | Hover de elementos sutis           | `#ede9fe` |
| `brand-500` | Foco / gradientes                  | `#8b5cf6` |
| `brand-600` | **Cor primária** (botões, links)   | `#7c3aed` |
| `brand-700` | Hover do primário                  | `#6d28d9` |
| `brand-800` | Estados ativos / texto sobre claro | `#5b21b6` |
| `slate-50`  | Fundo da aplicação                 | `#f8fafc` |
| `slate-900` | Texto principal                    | `#0f172a` |

### Cores semânticas

- **Sucesso / Ativo:** `emerald` (também identifica o tipo _House_).
- **Atenção:** `amber`.
- **Erro / Destrutivo:** `rose`.
- **Neutro / Imobiliária:** `brand` (violeta).

> O tipo de entidade é codificado por cor: **Imobiliária** usa o violeta da marca
> e **House** usa o verde esmeralda, reforçando a distinção visualmente.

## Tipografia

Fonte **Inter** (com fallback para a pilha de fontes do sistema), escolhida pela
legibilidade em interfaces densas de dados.

- Títulos de página: `text-2xl font-bold tracking-tight`
- Títulos de seção/card: `text-base font-semibold`
- Corpo: `text-sm`
- Labels/metadados: `text-xs uppercase tracking-wide` (cinza)

## Componentes (`@vynce/ui`)

| Componente                       | Variantes / props                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| `Button`                         | `primary`, `secondary`, `ghost`, `danger`, `subtle` · `sm`/`md`/`lg`/`icon` · `isLoading` |
| `Input` / `Textarea`             | estado `invalid` com anel de foco vermelho                                                |
| `Select`                         | nativo, com ícone de chevron                                                              |
| `Field`                          | agrupa label, controle, dica (`hint`) e erro                                              |
| `Card` + `CardHeader`/`CardBody` | contêiner padrão de conteúdo                                                              |
| `Badge`                          | tons `brand`, `emerald`, `amber`, `slate`, `rose`                                         |
| `Spinner`                        | indicador de carregamento                                                                 |

### Princípios de UX

- **Formulários por seções** (Identificação, Contato, Endereço, Adicionais,
  Gerente) em cards, reduzindo a carga cognitiva de um cadastro extenso.
- **Máscaras em tempo real** para CNPJ, CPF, CEP e telefone.
- **Preenchimento automático de endereço** ao informar o CEP (ViaCEP), com
  degradação graciosa caso a rede falhe.
- **Feedback de validação inline**, destacando exatamente os campos com erro.
- **Acessibilidade**: foco visível, labels associadas, contraste adequado.

## Layout

- **Sidebar** fixa (desktop) com navegação e identidade da marca.
- **Topbar** com breadcrumb contextual.
- Conteúdo centralizado com largura máxima (`max-w-6xl`) para conforto de leitura.
