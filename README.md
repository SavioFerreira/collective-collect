# Coleta Coletiva - Collective Collect

## Descrição
**Coleta Coletiva - Collective Collect** é um aplicativo móvel desenvolvido para permitir que a população de áreas carentes denuncie e participe de coletas de resíduos descartados irregularmente. O app facilita a união comunitária, promovendo ações coletivas para preservar o ambiente local e melhorar a qualidade de vida através da gestão eficaz de resíduos.

## Funcionalidades
- **Denúncias de Resíduos:** Usuários podem enviar denúncias fornecendo fotos, localizações, descrições e tipo dos resíduos.
- **Gestão de Coletas:** O sistema automaticamente gera coletas baseadas nas denúncias e as adiciona em uma lista e mapa interativo.
- **Participação em Coletas:** Usuários podem visualizar detalhes das coletas, e se registrar para participar e interagir através de um sistema de chat para alinhar ações e métodos de coleta com outros usuários.
- **Administração de Coletas:** O primeiro usuário a registrar em uma coleta pode definir a coleta como privada ou aberta, influenciando quem pode participar da coleta.

## Tecnologias Utilizadas
### Backend
- **Java / Spring Boot:** Estrutura principal para criação de endpoints da API e lógica de negócios.
- **Spring Data JPA / Hibernate:** Facilita a interação com o banco de dados PostgreSQL.
- **Spring Security com JWT:** Fornece autenticação e proteção através de tokens JWT.
- **Spring Crypto:** Utilizado para criptografia de senhas.
- **Lombok:** Reduz a verbosidade do código Java, automatizando getters, setters, e construtores.

### Frontend
- **React Native / TypeScript:** Framework usado para desenvolver uma interface móvel amigável e responsiva.
- **Native Base**: Biblioteca responsável pelo layout da aplicação baseado em componentes
- **Expo:** Gerencia as dependências do projeto e facilita o teste em diferentes plataformas.
- **Async Storage, DatePicker Community, React Native Maps:** Bibliotecas utilizadas para armazenamento local, seleção de datas e mapeamento de coletas.