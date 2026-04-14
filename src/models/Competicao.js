class Competicao {
    constructor(data) {
        this.id = data.id;
        this.nome = data.nome;
        this.tipo = data.tipo;
        this.data_inicio = data.data_inicio;
        this.data_fim = data.data_fim;
        this.status = data.status;
        this.local = data.local;
        this.created_by = data.created_by;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        if (data.admin_nome) this.admin_nome = data.admin_nome;
    }
}

module.exports = Competicao;

