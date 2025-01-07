-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "cpf_usuario" TEXT NOT NULL,
    "nome_usuario" TEXT NOT NULL,
    "email_usuario" TEXT NOT NULL,
    "senha_usuario" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Pet" (
    "id_pet" SERIAL NOT NULL,
    "nome_pet" TEXT NOT NULL,
    "especie" TEXT NOT NULL,
    "raca" TEXT NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "usuarioId_usuario" INTEGER NOT NULL,

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id_pet")
);

-- CreateTable
CREATE TABLE "Clinica" (
    "id_clinica" SERIAL NOT NULL,
    "nome_clinica" TEXT NOT NULL,
    "endereco_clinica" TEXT NOT NULL,
    "telefone_clinica" TEXT NOT NULL,
    "foto_clinica" TEXT NOT NULL,
    "avaliacao_clinica" TEXT NOT NULL,
    "total_avaliacoes" INTEGER NOT NULL,

    CONSTRAINT "Clinica_pkey" PRIMARY KEY ("id_clinica")
);

-- CreateTable
CREATE TABLE "Servico" (
    "id_servico" SERIAL NOT NULL,
    "nome_servico" TEXT NOT NULL,
    "descricao_servico" TEXT NOT NULL,
    "preco_servico" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("id_servico")
);

-- CreateTable
CREATE TABLE "Avaliacao" (
    "id_avaliacao" SERIAL NOT NULL,
    "nota_avaliacao" INTEGER NOT NULL,
    "comentario_avaliacao" TEXT NOT NULL,
    "data_avaliacao" TIMESTAMP(3) NOT NULL,
    "clinicaId_clinica" INTEGER NOT NULL,
    "usuarioId_usuario" INTEGER NOT NULL,

    CONSTRAINT "Avaliacao_pkey" PRIMARY KEY ("id_avaliacao")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cpf_usuario_key" ON "Usuario"("cpf_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_usuario_key" ON "Usuario"("email_usuario");

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_usuarioId_usuario_fkey" FOREIGN KEY ("usuarioId_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_clinicaId_clinica_fkey" FOREIGN KEY ("clinicaId_clinica") REFERENCES "Clinica"("id_clinica") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Avaliacao" ADD CONSTRAINT "Avaliacao_usuarioId_usuario_fkey" FOREIGN KEY ("usuarioId_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;
