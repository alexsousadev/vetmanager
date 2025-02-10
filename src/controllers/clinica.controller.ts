import { Request, Response } from "express";
import { prisma } from "../services/database.service";
import { z, ZodError } from "zod";

const clinicaCadastroSchema = z.object({
    id_clinica: z.number(),
    nome_clinica: z.string(),
    cnpj_clinica: z.string(),
    telefone_clinica: z.string(),
    foto_clinica: z.string(),
    avaliacao_clinica: z.number(),
    total_avaliacoes: z.number(),
});

const ClinicasCadastroSchema = z.array(clinicaCadastroSchema);

// schema de cadastro de servicos
const clinicaServicoSchema = z.object({
    id_tipo_servico: z.number(),
    servicoId: z.number(),
    clinicaId: z.number(),
    tipoServicoId: z.number(),
});

const ClinicaServicoSchema = z.array(clinicaServicoSchema);

export const cadastroServicosClinica = async (req: Request, res: Response) => {
    try {
        const servicos = ClinicaServicoSchema.parse(req.body);
        const servicosCadastrados = await Promise.all(servicos.map(async (servico) => {
            // Verifica se o id_servico existe na tabela Servico
            const servicoExistente = await prisma.servico.findUnique({
                where: { id_servico: servico.servicoId },
            });
            if (!servicoExistente) {
                throw new Error(`O serviço com ID ${servico.servicoId} não existe.`);
            }

            const tipoServicoExistente = await prisma.tipoServico.findUnique({
                where: { id_tipo_servico: servico.tipoServicoId },
            });

            if (!tipoServicoExistente) {
                throw new Error(`O tipo de serviço com ID ${servico.tipoServicoId} não existe.`);
            }

            // Verifica se o id_clinica existe na tabela Clinica
            const clinicaExistente = await prisma.clinica.findUnique({
                where: { id_clinica: servico.clinicaId },
            });
            if (!clinicaExistente) {
                throw new Error(`A clínica com ID ${servico.clinicaId} não existe.`);
            }

            // Verifica se já existe uma relação entre o serviço e a clínica
            const servicoClinicaExistente = await prisma.servicoClinica.findFirst({
                where: {
                    AND: [
                        { servicoId_servico: servico.servicoId },
                        { clinicaId: servico.clinicaId }
                    ]
                }
            });

            if (servicoClinicaExistente) {
                return servicoClinicaExistente;
            }

            const novoServico = await prisma.servicoClinica.create({
                data: {
                    id_servico_clinica: servico.id_tipo_servico,
                    servicoId_servico: servico.servicoId,
                    clinicaId: servico.clinicaId,
                    tipoServicoId_tipo_servico: servico.tipoServicoId
                },
            });
            return novoServico;
        }));
        return res.status(201).json(servicosCadastrados);
    } catch (error) {
        console.error("Erro ao cadastrar vários serviços:", error);
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: error.errors,
            });
        }
        return res.status(500).json({ message: "Erro ao cadastrar vários serviços", error });
    }
}

// listar clinicas
export const listarClinicas = async (req: Request, res: Response) => {
    try {
        // Busca todas as clínicas
        const clinicas = await prisma.clinica.findMany();

        if (!clinicas || clinicas.length === 0) {
            return res.status(404).json({ message: "Nenhuma clínica encontrada!" });
        }

        // Para cada clínica, busca as informações de localização e serviços
        const clinicasComDetalhes = await Promise.all(clinicas.map(async (clinica) => {
            try {
                // Busca a localização da clínica
                const localizacaoClinica = await listarLocalizacaoClinica(clinica.id_clinica);

                // Busca os serviços da clínica
                const servicosDaClinica = await servicosClinicaCategoria(clinica.id_clinica);

                // Retorna um objeto com todas as informações da clínica
                return {
                    ...clinica, // Inclui todos os dados da clínica
                    localizacao: localizacaoClinica || null, // Se não houver localização, retorna null
                    servicos: servicosDaClinica || [] // Se não houver serviços, retorna um array vazio
                };
            } catch (error) {
                console.error(`Erro ao buscar detalhes da clínica ${clinica.id_clinica}:`, error);
                return {
                    ...clinica, // Retorna pelo menos os dados básicos da clínica
                    localizacao: null, // Localização não disponível devido ao erro
                    servicos: [] // Serviços não disponíveis devido ao erro
                };
            }
        }));

        // Retorna o JSON com todas as clínicas e suas informações
        return res.status(200).json(clinicasComDetalhes);
    } catch (error) {
        console.error("Erro ao listar clínicas:", error);
        return res.status(500).json({ message: "Erro ao listar clínicas", error });
    }
};
// traz localização da clinica
export const listarLocalizacaoClinica = async (idClinica: number) => {
    try {
        const localizacao = await prisma.localizacaoClinica.findFirst({
            where: {
                clinicaId_clinica: idClinica
            }
        });
        return localizacao;
    } catch (error) {
        console.error("Erro ao listar localização da clínica:", error);
        return null;
    }
};


const servicoClinicaSchema = z.object({
    id_servico_clinica: z.number(),
    clinicaId: z.number(),
    tipoServicoId_tipo_servico: z.number(),
    servicoId_servico: z.number().nullable(),
    nome_tipo_servico: z.string().optional()
});

type ServicoClinicaSchema = z.infer<typeof servicoClinicaSchema>;

export const servicosClinicaCategoria = async (idClinica: number) => {
    try {
        // Busca todos os serviços da clínica
        const servicosClinica = await prisma.servicoClinica.findMany({
            where: {
                clinicaId: idClinica
            }
        });

        // Para cada serviço, busca o nome do tipo de serviço
        const nomesServicos = await Promise.all(
            servicosClinica.map(async (servico) => {
                // Encontra o tipo de serviço
                const tipoServico = await prisma.servico.findUnique({
                    where: {
                        id_servico: servico.servicoId_servico ?? undefined
                    }
                });

                if (!tipoServico) {
                    throw new Error(`Tipo de serviço não encontrado para o ID: ${servico.servicoId_servico}`);
                }

                const tipoTrabalhoServico = await servicoTrabalhoClinica(idClinica, tipoServico?.id_servico);


                if (!tipoServico) {
                    throw new Error(`Tipo de serviço não encontrado para o ID: ${servico.servicoId_servico}`);
                }

                // Retorna o nome do tipo de serviço
                return { nome_servico: tipoServico.nome_servico, trabalho: tipoTrabalhoServico }
            })
        );

        // Remove duplicatas (se necessário)
        const nomesUnicos = [...new Set(nomesServicos)];

        return nomesUnicos; // Retorna um array com os nomes dos serviços únicos
    } catch (error) {
        console.error("Erro ao listar serviços da clínica:", error);
        return null;
    }
};


// retorna serviços da clinica
export const servicoTrabalhoClinica = async (idClinica: number, servicoId: number): Promise<string[]> => {
    let trabalhosServicos: string[] = [];
    try {
        // Busca todos os serviços da clínica
        const tarefasServicosClinica = await prisma.servicoClinica.findMany({
            where: {
                clinicaId: idClinica
            }
        });

        // Mapeia os serviços para o formato ServicoClinicaSchema
        const servicosFormatados = await Promise.all(tarefasServicosClinica.map(async (servico) => {
            // Encontra o tipo de serviço

            // Giardia? Nutrição? Gripe Canina?
            let tipoServico = await prisma.tipoServico.findUnique({
                where: {
                    id_tipo_servico: servico.tipoServicoId_tipo_servico
                }
            })

            if (!tipoServico) {
                throw new Error(`Tipo de serviço não encontrado para o ID: ${servico.tipoServicoId_tipo_servico}`);
            }

            if (servico.servicoId_servico == servicoId) {
                trabalhosServicos.push(tipoServico?.nome_tipo);
            }

        }));

        return trabalhosServicos;
    } catch (error) {
        console.error("Erro ao listar serviços da clínica:", error);
        return [];
    }
};


const horarioSchema = z.object({
    id_dia: z.number(),
    horario_inicio: z.string(),
    horario_fim: z.string(),
    clinicaId: z.number(),
});

const horarioClinicaSchema = z.array(horarioSchema);


export const cadastroHorario = async (req: Request, res: Response) => {
    try {
        const horarios = horarioClinicaSchema.parse(req.body); // Recebe o array de horários

        const horariosCadastrados = await Promise.all(horarios.map(async (horario) => {
            // Verifica se o id_dia existe na tabela DiaSemana
            const diaExistente = await prisma.diaSemana.findUnique({
                where: { id_dia: horario.id_dia },
            });

            if (!diaExistente) {
                throw new Error(`O dia da semana com id ${horario.id_dia} não existe.`);
            }

            const novoHorario = await prisma.horarioFuncionamento.create({
                data: {
                    horario_inicio: horario.horario_inicio,
                    horario_fim: horario.horario_fim,
                    id_dia: horario.id_dia,
                    clinicaId: horario.clinicaId,
                },
            });
            return novoHorario; // Retorna o horário cadastrado
        }));

        return res.status(201).json({ message: "Horários cadastrados com sucesso", horarios: horariosCadastrados });
    } catch (error) {
        console.error("Erro ao cadastrar horários:", error);
        return res.status(500).json({ message: "Erro ao cadastrar horários", error });
    }
};

// cadastrar clinica
export const cadastrarClinicas = async (req: Request, res: Response) => {
    try {
        const clinicas = ClinicasCadastroSchema.parse(req.body); // Valida o corpo da requisição

        const clinicasCadastradas = await Promise.all(clinicas.map(async (clinica) => {
            const novaClinica = await prisma.clinica.create({
                data: {
                    id_clinica: clinica.id_clinica,
                    cnpj_clinica: clinica.cnpj_clinica,
                    nome_clinica: clinica.nome_clinica,
                    telefone_clinica: clinica.telefone_clinica,
                    foto_clinica: clinica.foto_clinica,
                    avaliacao_clinica: clinica.avaliacao_clinica,
                    total_avaliacoes: clinica.total_avaliacoes,
                },
            });
            return novaClinica; // Retorna a clínica cadastrada
        }));

        return res.status(201).json({ message: "Clínicas cadastradas com sucesso", clinicas: clinicasCadastradas });
    } catch (error) {
        console.error("Erro ao cadastrar clínicas:", error);
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: error.errors,
            });
        }
        return res.status(500).json({ message: "Erro ao cadastrar clínicas", error });
    }
};

const localizacaoSchema = z.object({
    latitude: z.number(),
    longitude: z.number(),
    endereco: z.string(),
    cidade: z.string(),
    estado: z.string(),
    cep: z.string(),
    id_clinica: z.number(),
});

const localizacaoClinicaSchema = z.array(localizacaoSchema);

export const cadastroLocalizacao = async (req: Request, res: Response) => {
    try {
        const localizacoes = localizacaoClinicaSchema.parse(req.body); // Recebe o array de localizações

        const localizacoesCadastradas = await Promise.all(localizacoes.map(async (localizacao) => {
            // Verifica se a clínica existe
            const clinicaExistente = await prisma.clinica.findUnique({
                where: { id_clinica: localizacao.id_clinica },
            });

            if (!clinicaExistente) {
                throw new Error(`Clínica com ID ${localizacao.id_clinica} não encontrada.`);
            }

            const novaLocalizacao = await prisma.localizacaoClinica.create({
                data: {
                    latitude: localizacao.latitude,
                    longitude: localizacao.longitude,
                    endereco: localizacao.endereco,
                    cidade: localizacao.cidade,
                    estado: localizacao.estado,
                    cep: localizacao.cep,
                    clinicaId_clinica: localizacao.id_clinica, // Associa a localização à clínica
                },
            });
            return novaLocalizacao; // Retorna a localização cadastrada
        }));

        return res.status(201).json({ message: "Localizações cadastradas com sucesso", localizacoes: localizacoesCadastradas });
    } catch (error) {
        console.error("Erro ao cadastrar localizações:", error);
        return res.status(500).json({ message: "Erro ao cadastrar localizações" });
    }
};

export const atualizarClinica = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            nome_clinica,
            endereco_clinica,
            telefone_clinica,
            foto_clinica,
            avaliacao_clinica,
            total_avaliacoes,
        } = req.body;

        const clinica = await prisma.clinica.findUnique({
            where: { id_clinica: Number(id) },
        });

        if (!clinica) {
            return res.status(404).json({ message: "Clínica não encontrada!" });
        }

        const clinicaAtualizada = await prisma.clinica.update({
            where: { id_clinica: Number(id) },
            data: {
                nome_clinica,
                telefone_clinica,
                foto_clinica,
                avaliacao_clinica,
                total_avaliacoes,
            },
        });

        return res.status(200).json(clinicaAtualizada);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao atualizar clínica", error });
    }
};

export const deletarClinica = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const clinica = await prisma.clinica.findUnique({
            where: { id_clinica: Number(id) },
        });

        if (!clinica) {
            return res.status(404).json({ message: "Clínica não encontrada!" });
        }

        await prisma.clinica.delete({
            where: { id_clinica: Number(id) },
        });

        return res.status(200).json({ message: "Clínica deletada com sucesso!" });
    } catch (error) {
        return res.status(500).json({ message: "Erro ao deletar clínica", error });
    }
};

export const detalhesClinica = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const clinica = await prisma.clinica.findUnique({
            where: { id_clinica: Number(id) },
            include: {
                Avaliacao: true, // Incluindo as avaliações da clínica
            },
        });

        if (!clinica) {
            return res.status(404).json({ message: "Clínica não encontrada!" });
        }

        return res.status(200).json(clinica);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao buscar detalhes da clínica", error });
    }
};

const clinicaSchema = z.object({
    id_clinica: z.number(),
    cnpj_clinica: z.string(),
    nome_clinica: z.string(),
    endereco_clinica: z.string(),
    telefone_clinica: z.string(),
    foto_clinica: z.string(),
    avaliacao_clinica: z.number(),
    total_avaliacoes: z.number(),
    id_localizacao: z.number(),
    LocalizacaoClinica: z.object({
        latitude: z.number(),
        longitude: z.number(),
        endereco: z.string(),
        cidade: z.string(),
        estado: z.string(),
        cep: z.string(),
    }).optional(),
    Horarios: z.array(z.object({
        horario_inicio: z.string(),
        horario_fim: z.string(),
        id_dia: z.number(),
        clinicaId: z.number(),
    })).optional(),
    Servicos: z.array(z.object({
        nome_servico: z.string(),
        descricao_servico: z.string(),
        preco_servico: z.number(),
    })).optional(),
});

const clinicasSchema = z.array(clinicaSchema);

export const cadastrarClinicasMultiplo = async (req: Request, res: Response) => {
    try {
        const clinicas = clinicasSchema.parse(req.body); // Validates the request body

        const clinicasCadastradas = await Promise.all(clinicas.map(async (clinica) => {
            // Check for required fields
            if (!clinica.LocalizacaoClinica || !clinica.Horarios || !clinica.Servicos) {
                throw new Error("LocalizacaoClinica, Horarios, and Servicos are required fields.");
            }

            const existingClinica = await prisma.clinica.findUnique({
                where: { cnpj_clinica: clinica.cnpj_clinica },
            });

            if (existingClinica) {
                throw new Error(`Uma clínica com o CNPJ ${clinica.cnpj_clinica} já existe.`);
            }

            const novaClinica = await prisma.clinica.create({
                data: {
                    id_clinica: clinica.id_clinica,
                    cnpj_clinica: clinica.cnpj_clinica,
                    nome_clinica: clinica.nome_clinica,
                    telefone_clinica: clinica.telefone_clinica,
                    foto_clinica: clinica.foto_clinica,
                    avaliacao_clinica: clinica.avaliacao_clinica,
                    total_avaliacoes: clinica.total_avaliacoes,
                },
            });

            await prisma.localizacaoClinica.create({
                data: {
                    latitude: clinica.LocalizacaoClinica.latitude,
                    longitude: clinica.LocalizacaoClinica.longitude,
                    endereco: clinica.LocalizacaoClinica.endereco,
                    cidade: clinica.LocalizacaoClinica.cidade,
                    estado: clinica.LocalizacaoClinica.estado,
                    cep: clinica.LocalizacaoClinica.cep,
                    clinicaId_clinica: novaClinica.id_clinica,
                },
            });

            await prisma.servico.createMany({
                data: clinica.Servicos.map((servico) => ({
                    id_servico: Math.floor(Math.random() * 1000000),
                    nome_servico: servico.nome_servico,
                    descricao_servico: servico.descricao_servico,
                    preco_servico: servico.preco_servico,
                })),
            });

            // Criar os horários da clínica
            await Promise.all(clinica.Horarios.map(async (horario) => {
                // Verifica se o id_dia existe na tabela DiaSemana
                const diaExistente = await prisma.diaSemana.findUnique({
                    where: { id_dia: horario.id_dia },
                });

                if (!diaExistente) {
                    throw new Error(`O dia da semana com id ${horario.id_dia} não existe.`);
                }

                await prisma.horarioFuncionamento.create({
                    data: {
                        horario_inicio: horario.horario_inicio,
                        horario_fim: horario.horario_fim,
                        id_dia: horario.id_dia,
                        clinicaId: novaClinica.id_clinica,
                    },
                });
            }));

            return novaClinica;
        }));

        return res.status(201).json(clinicasCadastradas);
    } catch (error) {
        console.error("Erro ao cadastrar várias clínicas:", error);
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: error.errors,
            });
        }
        return res.status(500).json({ message: "Erro ao cadastrar várias clínicas", error });
    }
};

const diaSemanaSchema = z.object({
    id_dia: z.number(),
    nome_dia: z.string(),
});

const DiasSemana = z.array(diaSemanaSchema);

export const cadastroDias = async (req: Request, res: Response) => {
    try {
        const dias = DiasSemana.parse(req.body); // Valida o corpo da requisição

        const diasCadastrados = await Promise.all(dias.map(async (dia, index) => {
            const novoDia = await prisma.diaSemana.create({
                data: {
                    id_dia: dia.id_dia,
                    nome_dia: dia.nome_dia,
                },
            });
            return novoDia;
        }));

        return res.status(201).json(diasCadastrados);
    } catch (error) {
        console.error("Erro ao cadastrar dias:", error);
        if (error instanceof ZodError) {
            return res.status(400).json({
                error: error.errors,
            });
        }
        return res.status(500).json({ message: "Erro ao cadastrar dias", error });
    }
}