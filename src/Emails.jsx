function Emails({ resultados }) {
	if (!resultados || resultados.length === 0) return null;
	return ( // tabela para mostrar os resultados 
		<table className="min-w-full border mt-8"> 
			<thead>
				<tr>
					<th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Resposta</th>
                    <th className="border px-4 py-2">Categoria</th>
				</tr>
			</thead>
			<tbody>
				{resultados.map((item, i) => (
					<tr key={i}>
						<td className="border px-4 py-2 whitespace-pre-line text-left" style={{width: 50+'%', wordBreak: 'break-word'}}>{item.texto}</td>
                        <td className="border px-4 py-2 whitespace-pre-line text-left" style={{width: 40+'%', wordBreak: 'break-word'}}>{item.resposta}</td>
						<td className="border px-4 py-2 text-center">{item.categoria}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default Emails;