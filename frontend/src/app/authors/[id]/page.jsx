import { use } from 'react';

export default function Page({ params }) {
    const { id } = use(params);
    
    return (
      <div>
        <h1>Details of Author with ID: {id}</h1>
      </div>
    )
  }