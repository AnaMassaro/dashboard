import React, { useMemo, useState, useEffect } from 'react';
import { Container, Content, Filters } from './styles'
import ContentHeader from '../../components/ContentHeader'
import SelectInput from '../../components/SelectInput'
import HistoryFinanceCard from '../../components/HistoryFinanceCard'

import gains from '../../repositories/gains';
import expenses from '../../repositories/expenses';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';

interface IRouteParams {
  match: {
    params: {
      type: string;
    }
  }
}

interface IData {
  id: string;
  description: string;
  amountFormatted: string;
  frequency: string;
  dataFormatted: string;
  tagColor: string;
}
const List: React.FC<IRouteParams> = ({ match }) => {

  /*useState é um array, onde na primeira posição ele guarda o valor do estado,
  e na segunda posição ele guarda uma função que atualiza o estado*/
  const [data, setData] = useState<IData[]>([]);
  const [monthSelected, setMonthSelected] = useState<string>('');
  const [yearSelected, setYearSelected] = useState<string>('');

  const { type } = match.params;
  const itens = useMemo(() => {
    return type === 'entry-balance' ? {
      title: 'Entradas',
      lineColor: '#F7931B'
    } : {
      title: 'Saídas',
      lineColor: '#E44C4E'
    }
  },[type]);


  const listData = useMemo(() => {
    return type === 'entry-balance' ? gains : expenses;
  },[type]);

  const months = [
    {value: 7, label: 'Julho'},
    {value: 8, label: 'Agosto'},
    {value: 9, label: 'Setembro'}
  ]

  const years = [
    {value: 2020, label: 2020},
    {value: 2019, label: 2019},
    {value: 2018, label: 2018},
  ]

  useEffect(() => {

    const response = listData.map(item => {
      return {
        id: String(Math.random() * data.length),
        description: item.description,
        amountFormatted: formatCurrency(Number(item.amount)),
        frequency: item.frequency,
        dataFormatted: formatDate(item.date),
        tagColor: item.frequency === 'recorrente' ? '#4E41F0' : '#E44C4E'
      }
    });

    setData(response);
  },[]);
  
  return (
    <Container>
       <ContentHeader title={itens.title} lineColor={itens.lineColor}>
        <SelectInput options={months} onChange={(e) => setMonthSelected(e.target.value)}/>
        <SelectInput options={years} onChange={(e) => setYearSelected(e.target.value)}/>
      </ContentHeader>

      <Filters>
        <button 
          type="button"
          className="tag-filter tag-filter-recurrent"
        >
          Recorrentes
        </button>

        <button 
          type="button"
          className="tag-filter tag-filter-eventual"
        >
          Eventuais
        </button>
      </Filters>

      <Content>
        {
          data.map(item => (
            <HistoryFinanceCard
              key={item.id}
              tagColor={item.tagColor}
              title={item.description}
              subtitle={item.dataFormatted}
              amount={item.amountFormatted}
            />
          ))
        }
      </Content>
    </Container>
  );
}

export default List;