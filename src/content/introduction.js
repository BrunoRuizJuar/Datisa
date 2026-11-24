export const introduction = {
  source: 'https://nlp.stanford.edu/IR-book/pdf/irbookonlinereading.pdf',
  lead: 'Un clasificador asigna una categoría a un documento. Para hacerlo necesita una forma de representar el texto y un criterio para elegir entre las categorías posibles.',
  blocks: [
    ['El problema', 'Una tienda recibe correos sobre entregas, facturación y atención. Alguien tiene que leerlos y enviarlos al equipo correspondiente. Si el volumen crece, esa clasificación manual puede retrasar la respuesta.'],
    ['Pregunta para la clase', '¿Qué pistas del mensaje «Mi pedido llegó, pero el cobro aparece dos veces» usarías para decidir a qué equipo enviarlo?'],
    ['De un mensaje a una decisión', 'Podemos empezar con correos que el equipo ya etiquetó. Al convertir los mensajes en rasgos numéricos, el modelo puede aprender qué patrones se asocian con cada categoría y aplicar ese criterio a un correo nuevo.'],
    ['La tarea en símbolos', 'Si d es un documento, φ(d) es su representación numérica y f es el clasificador, la predicción ŷ es la categoría que produce el modelo a partir de esa representación.', {tex: String.raw`\textcolor{#217453}{\hat y}=\textcolor{#704995}{f}(\textcolor{#8a561c}{\varphi}(\textcolor{#285f91}{d}))`, plain: 'ŷ = f(φ(d))', terms: [['prior','d','Documento de entrada sobre el que se hará la predicción.'],['evidence','φ','Representación que convierte el texto en un vector de rasgos.'],['parameter','f','Clasificador que toma ese vector y selecciona una categoría.'],['result','ŷ','Etiqueta que devuelve el clasificador.']]}],
    ['Ejemplo didáctico', 'Un mensaje que dice «Necesito una copia de mi factura» podría enviarse a Facturación. Las palabras «copia» y «factura» pueden contribuir a esa decisión. El comportamiento real depende de la representación y de los ejemplos de entrenamiento.'],
    ['Aplicaciones y límites', 'También podemos etiquetar noticias por tema o dirigir solicitudes de soporte. Un mensaje puede hablar de dos problemas a la vez, usar vocabulario nuevo o contener ironía. Esas situaciones pueden exigir varias etiquetas, revisión humana o una evaluación con ejemplos más representativos.'],
    ['Lo que sigue', 'Primero veremos qué significa aprender un patrón de los datos y qué papel tienen las etiquetas en esa tarea.']
  ]
};
