Feature: Enriquecimento de Dados de Livros

  O sistema deve processar um arquivo enviado pelo cliente contendo títulos e edições de livros,
  buscar dados complementares na base interna e gerar um novo arquivo com os dados enriquecidos.

  # Cenário 1
  Scenario: Enriquecer dados de livro com título e edição válidos
    Given que o cliente envia um arquivo CSV com o título "Dom Casmurro" e edição "1"
    When o sistema processa o arquivo
    Then o sistema deve retornar um novo arquivo com os dados enriquecidos
    And os campos "autor", "editora", "sinopse" e "data de publicação" devem estar preenchidos

  # Cenário 2
  Scenario: Título de livro não encontrado na base
    Given que o cliente envia um arquivo CSV com o título "Livro Inexistente" e edição "1"
    When o sistema processa o arquivo
    Then o sistema deve registrar que o título não foi encontrado
    And o sistema não deve interromper o processo para os demais livros

  # Cenário 3
  Scenario: Arquivo com campos obrigatórios vazios
    Given que o cliente envia um arquivo CSV com linhas onde o campo "título" está vazio
    When o sistema processa o arquivo
    Then o sistema deve ignorar as linhas inválidas
    And o sistema deve processar as demais linhas válidas normalmente

  # Cenário 4
  Scenario: Validação do formato de saída
    Given que o cliente envia um arquivo válido para enriquecimento
    When o sistema processa o arquivo
    Then o arquivo gerado deve estar em formato CSV
    And deve conter as colunas: título, edição, autor, editora, sinopse, data de publicação

  # Cenário 5
  Scenario: Processamento de grande volume de dados
    Given que o cliente envia um arquivo CSV com 10.000 títulos válidos
    When o sistema processa o arquivo
    Then o processamento deve ser concluído com sucesso
    And o tempo de resposta deve ser aceitável conforme o SLA definido

  # Cenário 6
  Scenario: Enriquecer dados de livro com múltiplas edições
    Given que o cliente envia um arquivo CSV com o título "Memórias Póstumas de Brás Cubas" nas edições "1", "2" e "3"
    When o sistema processa o arquivo
    Then o sistema deve enriquecer os dados para cada edição de forma individual
    And o arquivo de saída deve conter uma linha para cada edição com os dados correspondentes

  # Cenário 7
  Scenario: Arquivo com títulos e edições duplicados
    Given que o cliente envia um arquivo CSV contendo o título "A Hora da Estrela", edição "1" repetido em 3 linhas
    When o sistema processa o arquivo
    Then o sistema deve identificar as duplicatas
    And pode optar por ignorar, consolidar ou processar todos, conforme regra definida

  # Cenário 8
  Scenario: Arquivo com delimitador incorreto
    Given que o cliente envia um arquivo no formato CSV usando ponto e vírgula como separador
    When o sistema espera vírgulas como delimitador
    Then o sistema deve retornar uma mensagem de erro de formatação
    And não deve processar o arquivo até correção

  # Cenário 9
  Scenario: Arquivo enviado com extensão incorreta
    Given que o cliente envia um arquivo com extensão ".txt"
    When o sistema processa o arquivo
    Then o sistema deve rejeitar o arquivo
    And retornar uma mensagem de erro informando o formato suportado

  # Cenário 10
  Scenario: Ordenação dos dados no arquivo de saída
    Given que o cliente envia um arquivo com títulos em ordem aleatória
    When o sistema processa os dados
    Then o arquivo de saída deve estar ordenado alfabeticamente pelo título do livro
