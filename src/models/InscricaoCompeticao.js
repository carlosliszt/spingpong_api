class InscricaoCompeticao {
    constructor(data) {
        this.id = data.id;
        this.competicao_id = data.competicao_id;
        this.atleta_id = data.atleta_id;
        this.seed_num = data.seed_num;
        this.status = data.status;
        this.created_at = data.created_at;
        if (data.competicao_nome) this.competicao_nome = data.competicao_nome;
        if (data.atleta_nome) this.atleta_nome = data.atleta_nome;
    }
}

module.exports = InscricaoCompeticao;

