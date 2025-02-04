/*
  Warnings:

  - You are about to drop the column `endereco_clinica` on the `Clinica` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cnpj_clinica]` on the table `Clinica` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cnpj_clinica` to the `Clinica` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `avaliacao_clinica` on the `Clinica` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Clinica" DROP COLUMN "endereco_clinica",
ADD COLUMN     "cnpj_clinica" TEXT NOT NULL,
ALTER COLUMN "id_clinica" DROP DEFAULT,
DROP COLUMN "avaliacao_clinica",
ADD COLUMN     "avaliacao_clinica" DOUBLE PRECISION NOT NULL;
DROP SEQUENCE "Clinica_id_clinica_seq";

-- AlterTable
ALTER TABLE "Servico" ALTER COLUMN "id_servico" DROP DEFAULT;
DROP SEQUENCE "Servico_id_servico_seq";

-- CreateTable
CREATE TABLE "ServicoClinica" (
    "id_servico_clinica" SERIAL NOT NULL,
    "servicoId" INTEGER NOT NULL,
    "clinicaId" INTEGER NOT NULL,

    CONSTRAINT "ServicoClinica_pkey" PRIMARY KEY ("id_servico_clinica")
);

-- CreateTable
CREATE TABLE "LocalizacaoClinica" (
    "id_localizacao" SERIAL NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "endereco" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "clinicaId_clinica" INTEGER NOT NULL,

    CONSTRAINT "LocalizacaoClinica_pkey" PRIMARY KEY ("id_localizacao")
);

-- CreateTable
CREATE TABLE "DiaSemana" (
    "id_dia" INTEGER NOT NULL,
    "nome_dia" TEXT NOT NULL,

    CONSTRAINT "DiaSemana_pkey" PRIMARY KEY ("id_dia")
);

-- CreateTable
CREATE TABLE "HorarioFuncionamento" (
    "id_horario" SERIAL NOT NULL,
    "horario_inicio" TEXT NOT NULL,
    "horario_fim" TEXT NOT NULL,
    "id_dia" INTEGER NOT NULL,
    "clinicaId" INTEGER,

    CONSTRAINT "HorarioFuncionamento_pkey" PRIMARY KEY ("id_horario")
);

-- CreateTable
CREATE TABLE "Agendamento" (
    "id_agendamento" SERIAL NOT NULL,
    "data_agendamento" TIMESTAMP(3) NOT NULL,
    "horario_agendamento" TIMESTAMP(3) NOT NULL,
    "status_agendamento" TEXT NOT NULL,
    "id_servico" INTEGER NOT NULL,
    "id_pet" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_clinica" INTEGER NOT NULL,
    "resultadoId" INTEGER,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id_agendamento")
);

-- CreateTable
CREATE TABLE "ResultadoConsulta" (
    "id_resultado" SERIAL NOT NULL,
    "diagnostico" TEXT NOT NULL,
    "observacoes" TEXT,
    "id_agendamento" INTEGER NOT NULL,
    "data_resultado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResultadoConsulta_pkey" PRIMARY KEY ("id_resultado")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiaSemana_nome_dia_key" ON "DiaSemana"("nome_dia");

-- CreateIndex
CREATE UNIQUE INDEX "HorarioFuncionamento_id_horario_key" ON "HorarioFuncionamento"("id_horario");

-- CreateIndex
CREATE UNIQUE INDEX "ResultadoConsulta_id_agendamento_key" ON "ResultadoConsulta"("id_agendamento");

-- CreateIndex
CREATE UNIQUE INDEX "Clinica_cnpj_clinica_key" ON "Clinica"("cnpj_clinica");

-- AddForeignKey
ALTER TABLE "ServicoClinica" ADD CONSTRAINT "ServicoClinica_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id_servico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicoClinica" ADD CONSTRAINT "ServicoClinica_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id_clinica") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocalizacaoClinica" ADD CONSTRAINT "LocalizacaoClinica_clinicaId_clinica_fkey" FOREIGN KEY ("clinicaId_clinica") REFERENCES "Clinica"("id_clinica") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HorarioFuncionamento" ADD CONSTRAINT "HorarioFuncionamento_id_dia_fkey" FOREIGN KEY ("id_dia") REFERENCES "DiaSemana"("id_dia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HorarioFuncionamento" ADD CONSTRAINT "HorarioFuncionamento_clinicaId_fkey" FOREIGN KEY ("clinicaId") REFERENCES "Clinica"("id_clinica") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_id_servico_fkey" FOREIGN KEY ("id_servico") REFERENCES "Servico"("id_servico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_id_pet_fkey" FOREIGN KEY ("id_pet") REFERENCES "Pet"("id_pet") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_id_clinica_fkey" FOREIGN KEY ("id_clinica") REFERENCES "Clinica"("id_clinica") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_resultadoId_fkey" FOREIGN KEY ("resultadoId") REFERENCES "ResultadoConsulta"("id_resultado") ON DELETE SET NULL ON UPDATE CASCADE;
