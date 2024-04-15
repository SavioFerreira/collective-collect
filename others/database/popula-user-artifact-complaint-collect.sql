insert into
  "public"."user" ("name","email")
values
  ( 'savi', 'savi@email.com'),
  ('zoro', 'zoro@email.com'),
  ('luffy', 'luffy@email.comtblue'),
  ('omega', 'omega@email.com'),
  ('vertebra', 'vertebra@email.com'),
  ('brook', 'brook@email.com'),
  ('canis', 'scanis@email.com');
  
  
  insert into
  "public"."artifact" ("description", "locale", "title")
values
  (
    'vários pneus foram jogadas aqui na calçada da esquina de casa.',
    'rua genin da proposta feita',
    'Pneus na calcada'
  ),
  (
    'Tem um monte de lixo acumulado no lote baudio ao lado de casa',
    'avenida macacos me mordam, lá ele',
    'latas de tinta jogadas'
  ),
  (
    'Várias garrafas de plastico jogadas nesse lote.',
    'rua farofinha de mandioca, lá ele',
    'garrafas jogadas'
  );
  
  insert into
  "public"."complaint" (
    "artifact_id",
    "id",
    "date",
    "gravity",
    "image",
    "status",
    "type"
  )
values
  (
    1,
    1,
    '04/14/2024',
    'grave',
    'https://www.tnh1.com.br/fileadmin/_processed_/0/a/csm_csm_12687902_1118061648217426_8111060934634980345_n_dc9ce6c840_87d5da8509.jpg',
    'em analise',
    'outro'
  ),
  (
    2,
    2,
    '04/14/2024',
    'critico',
    'https://www.opovo.com.br/_midias/jpg/2021/05/12/750x500/1__p2a1893-15753413.jpg',
    'pendente',
    'diversos'
  ),
  (
    3,
    3,
    '04/14/2024',
    'moderado',
    'https://www.reciclasampa.com.br/imgs/conteudos/16_mais_de_70_porcento_dos_brasileiros_nao_separa_lixo_padrao.jpg',
    'concluido',
    'plastico'
  );
  
  

  insert into
  "public"."collect" (
    "artifact_id",
    "id",
    "date",
    "gravity",
    "status",
    "type"
  )
values
  (1, 1, '4/14/2024', 'critico', 'concluido', 'outro'),
  (2, 2, '4/8/2024', 'braixo', 'em analise', 'diversos'),
  (3, 3, '4/10/2024', 'moderado', 'pendente', 'plastico');