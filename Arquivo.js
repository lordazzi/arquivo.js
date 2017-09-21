/**
 * @author Ricardo Azzi Silva <ricardo.azzi@viavarejo.com.br>
 *
 * Classe responsável por efetuar a leitura / escrita de
 * arquivos no SO onde o browser está alocado
 */
var Arquivo = {

	/**
	 * Faz a chamada de um openfiledialog do sistema operacional
	 * para que o usuário possa escolher um arquivo para enviar
	 * para o sistema.
	 *
	 * Para garantia de funcionamento da função ela deve ser chamada
	 * somente quando se tratar de um script que se origine de um evento
	 * executado pelo usuário, se não o filedialog não será aberto
	 * 
	 * @param {Object} args
	 * Objeto de argumentos
	 *
	 * @param {Boolean} [args.multiple=true]
	 * Se poderá ser escolhido mais de um arquivo
	 *
	 * @param {String[]} [accept]
	 * Quais as extenções que você deseja permitir que o filedialog veja
	 *
	 * @param {Object} args.scope
	 * O escopo do qual a função de callback será chamada
	 *
	 * @param {Function} args.callback
	 * Callback dado após a escolha de um arquivo
	 *
	 * @param {Error} args.callback.err
	 * Argumento que diz se o efetuar da seleção do arquivo gerou um erro
	 * 
	 * @param {FileList} args.callback.files
	 * Lista de arquivos escolhidos
	 */
	abrir: function(args){
		if (args			=== undefined)	{ args			= {}; }
		if (args.accept		=== undefined)	{ args.accept	= false; }
		if (args.scope		=== undefined)	{ args.scope	= window; }
		if (args.multiple	=== undefined)	{ args.multiple	= true; }
		if (args.callback	=== undefined)	{ args.callback	= function(){}; }

		var el = document.createElement('input');
		el.setAttribute('type', 'file');

		if (args.multiple)
			el.setAttribute('multiple', 'multiple');

		if (args.accept) {
			var exts	= '.';
			exts		+= args.accept.join(', .');
			el.setAttribute('accept', exts);
		}

		el.addEventListener('change', function(){
			var files = [];
			for (var i = 0; i < el.files.length; i++)
				files.push(el.files[i]);

			args.callback && Object(args.callback) instanceof Function && args.callback.apply(args.scope, [ null, files ]);
			el.value = '';
			el.remove();
		});

		el.click();
	},

	/**
	 * Salva um arquivo no computador do usuário
	 * 
	 * @param {Object} args
	 * Objeto de argumentos
	 *
	 * @param {String} args.filename
	 * Nome com o qual o arquivo será salvo
	 *
	 * @param {String} args.content
	 * Conteúdo que será salvo o arquivo
	 *
	 * @param {Function} args.callback
	 * Callback padrão de execução de operação de IO, de fato não tem como saber
	 * quando o envio do arquivo foi concluido, então logo após chamar a operação
	 * o callback já é chamado
	 */
	salvar: function(args){
		if (args			=== undefined)	{ args			= {}; }
		if (args.filename	=== undefined)	{ throw 'O argumento "filename" é obrigatório.'; }
		if (args.content	=== undefined)	{ throw 'O argumento "content" é obrigatório.'; }

		var element			= document.createElement('a');
		var content			= 'data:text/plain;charset=utf-8,'+args.content;

		element.setAttribute('href',		encodeURI(content));
		element.setAttribute('download',	args.filename);
		element.click();
	}
};