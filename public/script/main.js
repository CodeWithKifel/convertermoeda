async function converterMoeda(valor, moedaInicial, moedasDestino) {
  try {
      const url = `https://v6.exchangerate-api.com/v6/67920952ab88d662a49916aa/latest/${moedaInicial}`;

      const resposta = await fetch(url);
      const dados = await resposta.json();

      // Verifica se a resposta foi bem-sucedida
      if (dados.result === 'success') {
          const taxasDeCambio = dados.conversion_rates;

          const resultados = moedasDestino.map(moeda => {
              const taxa = taxasDeCambio[moeda];
              if (taxa) {
                  return {
                      moeda,
                      valorConvertido: valor * taxa
                  };
              } else {
                  return {
                      moeda,
                      erro: 'Moeda não encontrada nas taxas de câmbio'
                  };
              }
          });

          return resultados;
      } else {
          throw new Error('Erro ao buscar taxas de câmbio');
      }
  } catch (erro) {
      console.error('Erro ao realizar a conversão:', erro);
  }
}

document.getElementById('form-conversao').addEventListener('submit', async (event) => {
  event.preventDefault();

  const valor = parseFloat(document.getElementById('valor').value);
  const moedaInicial = document.getElementById('moeda-inicial').value;
  const moedasDestino = Array.from(document.getElementById('moeda-destino').selectedOptions).map(option => option.value);

  const resultados = await converterMoeda(valor, moedaInicial, moedasDestino);

  const listaResultados = document.getElementById('lista-resultados');
  listaResultados.innerHTML = '';

  resultados.forEach(resultado => {
      const li = document.createElement('li');
      li.innerHTML = `${resultado.moeda}: <span class="moeda">${resultado.valorConvertido ? resultado.valorConvertido.toFixed(2) : resultado.erro}</span>`;
      listaResultados.appendChild(li);
  });
});
