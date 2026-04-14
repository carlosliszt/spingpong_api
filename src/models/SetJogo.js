class SetJogo {
    constructor(data) {
        this.id = data.id;
        this.jogo_id = data.jogo_id;
        this.numero_set = data.numero_set;
        this.pontos_atleta_a = data.pontos_atleta_a;
        this.pontos_atleta_b = data.pontos_atleta_b;
        this.vencedor_set_id = data.vencedor_set_id;
        this.created_at = data.created_at;
    }
}

module.exports = SetJogo;

