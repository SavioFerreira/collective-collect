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
    'garrafas pet foram jogadas aqui na calçada da esquina de casa.',
    'rua genin da proposta feita',
    'garrafas pet na calçada'
  ),
  (
    'umas 4 latas de tinta foram descartadas nesse lote baudio.',
    'avenida macacos me mordam, lá ele',
    'latas de tinta jogadas'
  ),
  (
    'uns sacos de lixo preto foram entulhados no lado de casa.',
    'rua farofinha de mandioca, lá ele',
    'sacos de lixo jogados'
  );

  insert into
  "public"."collect" (
    "artifact_id",
    "id",
    "data",
    "gravity",
    "status",
    "type"
  )
values
  (1, 1, '4/14/2024', 'critico', 'concluido', 'organico'),
  (2, 2, '4/8/2024', 'braixo', 'em analise', 'plastico'),
  (3, 3, '4/10/2024', 'moderado', 'pendente', 'alvenaria'); 
 