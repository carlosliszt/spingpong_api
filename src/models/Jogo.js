class Jogo {
    constructor(data) {
        this.id = data.id;
        this.competicao_id = data.competicao_id;
        this.fase = data.fase;
        this.rodada = data.rodada;
        this.atleta_a_id = data.atleta_a_id;
        this.atleta_b_id = data.atleta_b_id;
        this.vencedor_id = data.vencedor_id;
        this.status = data.status;
        this.data_hora_prevista = data.data_hora_prevista;
        this.data_hora_inicio = data.data_hora_inicio;
        this.data_hora_fim = data.data_hora_fim;
        this.observacoes = data.observacoes;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        if (data.competicao_nome) this.competicao_nome = data.competicao_nome;
        if (data.atleta_a_nome) this.atleta_a_nome = data.atleta_a_nome;
        if (data.atleta_b_nome) this.atleta_b_nome = data.atleta_b_nome;
        if (data.vencedor_nome) this.vencedor_nome = data.vencedor_nome;
    }
}

module.exports = Jogo;

