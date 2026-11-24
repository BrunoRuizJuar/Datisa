export const formalEquations = {
  '4-1-1-aprendizaje-automatico': {
    tex: String.raw`\textcolor{#217453}{\hat\theta}=\textcolor{#704995}{\arg\min_{\theta\in\Theta}}\;\textcolor{#8a561c}{\widehat R(\theta)}`,
    plain: 'θ̂ es un parámetro que minimiza el riesgo empírico R̂(θ) sobre Θ.',
    terms: [
      ['result', 'θ̂', 'Parámetros elegidos por el criterio de entrenamiento, cuando existe un mínimo.'],
      ['parameter', 'arg mín, θ ∈ Θ', 'Busca los parámetros θ dentro del conjunto admisible Θ. Si hay varios mínimos, el criterio por sí solo no distingue entre ellos.'],
      ['evidence', 'R̂(θ)', 'Riesgo empírico. Promedia las pérdidas de entrenamiento que resultan al usar θ.']
    ]
  },
  '4-2-1-naive-bayes': {
    tex: String.raw`\textcolor{#217453}{P(O)}=\textcolor{#285f91}{P(S)}\,\textcolor{#8a561c}{P(O\mid S)}+\textcolor{#285f91}{P(L)}\,\textcolor{#8a561c}{P(O\mid L)}`,
    plain: 'P(O) = P(S) × P(O | S) + P(L) × P(O | L).',
    terms: [
      ['result', 'P(O)', 'Probabilidad marginal de observar «oferta». Es el denominador del teorema de Bayes en este ejemplo.'],
      ['prior', 'P(S), P(L)', 'Probabilidades previas de spam y correo legítimo. Ponderan los aportes de las dos clases.'],
      ['evidence', 'P(O | S), P(O | L)', 'Probabilidades condicionales de «oferta» dentro de cada clase. Cada producto aporta la probabilidad conjunta de esa clase y de «oferta».']
    ]
  },
  '4-3-1-vecinos-cercanos': {
    tex: String.raw`\textcolor{#217453}{\hat y(\mathbf x)}=\textcolor{#704995}{\arg\max_{c\in C}\sum_{i\in N_k(\mathbf x)}}\textcolor{#8a561c}{\mathbf 1\{\textcolor{#285f91}{y_i}=c\}}`,
    plain: 'La clase predicha para x maximiza el número de vecinos con etiqueta c entre los k más próximos.',
    terms: [
      ['result', 'ŷ(x)', 'Clase predicha para el documento representado por x.'],
      ['parameter', 'arg máx, c ∈ C', 'Busca, entre las categorías posibles, la que recibe más votos. Un empate necesita una regla adicional.'],
      ['parameter', 'Nₖ(x), Σ', 'Selecciona los índices de los k vecinos más cercanos a x y suma sus aportes.'],
      ['prior', 'yᵢ', 'Etiqueta conocida del documento vecino i.'],
      ['evidence', '1{yᵢ = c}', 'Función indicadora. Vale uno si el vecino vota por c y cero en otro caso.']
    ]
  },
  '4-3-2-maquinas-vectores-soporte': {
    tex: String.raw`\begin{aligned}
      &\textcolor{#704995}{\min_{\mathbf w,b}}\;\textcolor{#217453}{\tfrac12\|\mathbf w\|_2^2}\\
      &\text{sujeto a}\quad
      \textcolor{#285f91}{y_i}\,\textcolor{#8a561c}{(\mathbf w^{\mathsf T}\mathbf x_i+b)}\geq\textcolor{#704995}{1}\quad\forall i
      \end{aligned}`,
    plain: 'Minimizar ½ ‖w‖² sujeto a que yᵢ(wᵀxᵢ + b) sea al menos 1 para todo ejemplo i.',
    terms: [
      ['parameter', 'mín sobre w, b', 'Busca los pesos y el sesgo de un hiperplano que satisfaga todas las restricciones.'],
      ['result', '½ ‖w‖₂²', 'Objetivo cuadrático. Reducirlo aumenta el ancho del margen porque este es inversamente proporcional a la norma de w.'],
      ['prior', 'yᵢ', 'Etiqueta codificada como +1 o −1. Multiplicar por ella orienta la puntuación hacia el lado correspondiente a la clase.'],
      ['evidence', 'wᵀxᵢ + b', 'Puntuación del documento de entrenamiento i. El producto punto suma las contribuciones de sus rasgos y el sesgo desplaza la frontera.'],
      ['parameter', '≥ 1, ∀ i', 'Exige que cada ejemplo quede en el lado correcto y al menos en el borde de su margen. Esta es la restricción de margen duro.']
    ]
  }
};