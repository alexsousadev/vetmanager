/*
  Warnings:

  - You are about to drop the column `id_servico` on the `Agendamento` table. All the data in the column will be lost.
  - You are about to drop the column `especie` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `peso` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `raca` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `servicoId` on the `ServicoClinica` table. All the data in the column will be lost.
  - Added the required column `tipoServicoId_tipo_servico` to the `Agendamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `altura_pet` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `especie_pet` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `peso_pet` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `raca_pet` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sexo_pet` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoServicoId_tipo_servico` to the `ServicoClinica` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foto_usuario` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Agendamento" DROP CONSTRAINT "Agendamento_id_servico_fkey";

-- DropForeignKey
ALTER TABLE "ServicoClinica" DROP CONSTRAINT "ServicoClinica_servicoId_fkey";

-- AlterTable
ALTER TABLE "Agendamento" DROP COLUMN "id_servico",
ADD COLUMN     "servicoId_servico" INTEGER,
ADD COLUMN     "tipoServicoId_tipo_servico" INTEGER NOT NULL,
ALTER COLUMN "horario_agendamento" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "especie",
DROP COLUMN "peso",
DROP COLUMN "raca",
ADD COLUMN     "altura_pet" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "especie_pet" TEXT NOT NULL,
ADD COLUMN     "peso_pet" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "raca_pet" TEXT NOT NULL,
ADD COLUMN     "sexo_pet" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ServicoClinica" DROP COLUMN "servicoId",
ADD COLUMN     "servicoId_servico" INTEGER,
ADD COLUMN     "tipoServicoId_tipo_servico" INTEGER NOT NULL,
ALTER COLUMN "id_servico_clinica" DROP DEFAULT;
DROP SEQUENCE "ServicoClinica_id_servico_clinica_seq";

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "foto_usuario" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TipoServico" (
    "id_tipo_servico" INTEGER NOT NULL,
    "nome_tipo" TEXT NOT NULL,
    "servicoId_servico" INTEGER NOT NULL,

    CONSTRAINT "TipoServico_pkey" PRIMARY KEY ("id_tipo_servico")
);

-- AddForeignKey
ALTER TABLE "ServicoClinica" ADD CONSTRAINT "ServicoClinica_tipoServicoId_tipo_servico_fkey" FOREIGN KEY ("tipoServicoId_tipo_servico") REFERENCES "TipoServico"("id_tipo_servico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicoClinica" ADD CONSTRAINT "ServicoClinica_servicoId_servico_fkey" FOREIGN KEY ("servicoId_servico") REFERENCES "Servico"("id_servico") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipoServico" ADD CONSTRAINT "TipoServico_servicoId_servico_fkey" FOREIGN KEY ("servicoId_servico") REFERENCES "Servico"("id_servico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_tipoServicoId_tipo_servico_fkey" FOREIGN KEY ("tipoServicoId_tipo_servico") REFERENCES "TipoServico"("id_tipo_servico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_servicoId_servico_fkey" FOREIGN KEY ("servicoId_servico") REFERENCES "Servico"("id_servico") ON DELETE SET NULL ON UPDATE CASCADE;
