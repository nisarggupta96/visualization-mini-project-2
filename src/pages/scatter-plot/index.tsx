import axios from 'axios';
import { GetStaticProps } from 'next';
import { useEffect } from 'react';

export default function ScatterPlot({ data }: { data: Number[] }) {
    useEffect(() => {
        console.log('----here-----')
        console.log(data);
    }, [])
    return (
        <div>
            Scatter Plot
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const data = await (await axios.get('http://127.0.0.1:5000/get_scree_data')).data;
    console.log('---------getStaticProps-----------', data);
    return {
        props: {
            data: data
        }
    }
}
