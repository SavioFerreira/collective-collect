

 
insert into
  "public"."complaint" (
    "id",
    "id_author"
    "title",
    "description",
    "locale",
    "date",
    "gravity",
    "status",
    "type",
    "image"
  )
values
  (

    1,
    3,
    'Pneus na calcada',
    'vários pneus foram jogadas aqui na calçada da esquina de casa.',
    'rua genin da proposta feita',
    '04/14/2024',
    'GRAVE',
    'EM_ANALISE',
    'METAL',
    'https://www.tnh1.com.br/fileadmin/_processed_/0/a/csm_csm_12687902_1118061648217426_8111060934634980345_n_dc9ce6c840_87d5da8509.jpg'
  ),
  (
  
    2,
    1,
    'latas de tinta jogadas',
    'Tem um monte de lixo acumulado no lote baudio ao lado de casa',
    'avenida macacos me mordam, lá ele',
    '04/14/2024',
    'CRITICO',
    'PENDENTE',
    'PLASTICO',
    'https://www.opovo.com.br/_midias/jpg/2021/05/12/750x500/1__p2a1893-15753413.jpg'
  ),
  (
   
    3,
    4,
    'garrafas jogadas',
    'Várias garrafas de plastico jogadas nesse lote.',
    'rua farofinha de mandioca, lá ele',
    '04/14/2024',
    'LEVE',
    'CONCLUIDO',
    'ALVENARIA',
    'https://www.reciclasampa.com.br/imgs/conteudos/16_mais_de_70_porcento_dos_brasileiros_nao_separa_lixo_padrao.jpg'
  );
  