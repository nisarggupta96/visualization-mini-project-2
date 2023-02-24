import axios from 'axios';
import { GetStaticProps } from 'next';
import { useEffect } from 'react';

export default function ScreePlot({ data }: { data: Number[] }) {
    useEffect(() => {
        console.log('----here-----')
        console.log(data);
    })
    return (
        <div>
            Scree Plot here
        </div>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const data = await (await axios.get('http://127.0.0.1:5000/get_scree_data')).data;
    return {
        props: {
            data: data
        }
    }
}
