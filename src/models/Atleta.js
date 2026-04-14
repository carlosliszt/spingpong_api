class Atleta {
    constructor(data) {
        this.id = data.id;
        this.nome = data.nome;
        this.data_nascimento = data.data_nascimento;
        this.sexo = data.sexo;
        this.email = data.email;
        this.telefone = data.telefone;
        this.ativo = data.ativo;
        this.rating_atual = data.rating_atual;
        this.ranking_posicao = data.ranking_posicao;
        this.partidas_jogadas = data.partidas_jogadas;
        this.vitorias = data.vitorias;
        this.derrotas = data.derrotas;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

module.exports = Atleta;

