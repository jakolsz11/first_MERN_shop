import { Form } from "react-bootstrap";

const AttributesFilterComponent = ({attrsFilter, setAttrsFromFilter}) => {
  return (
    <>
      {attrsFilter && attrsFilter.length > 0 && attrsFilter.map((filter, idx) => (
        <div className="mb-3" key={idx}>
        <Form.Label><b>{filter.key}</b></Form.Label>
        {filter.value.map((valueForKey, idx2) => (
          <Form.Check key={idx2} type="checkbox" label={valueForKey} onChange={e => {
            setAttrsFromFilter(filters => {
              if(filters.length === 0){
                return [{key: filter.key, values: [valueForKey]}];
              }

              let index = filters.findIndex((item) => item.key === filter.key);

              if(index === -1){
                return [...filters, { key: filter.key, values: [valueForKey]}];
              }
              
              if(e.target.checked){
                filters[index].values.push(valueForKey);
                let unique = [...new Set(filters[index].values)];
                filters[index].values = unique;
                return [...filters]
              }

              let valuesWithoutUnChecked = filters[index].values.filter((val) => val !== valueForKey)
              filters[index].values = valuesWithoutUnChecked;
              if(valuesWithoutUnChecked.length > 0){
                return [...filters];
              }
              else{
                let filtersWithoutOneKey = filters.filter(item => item.key !== filter.key);
                return [...filtersWithoutOneKey]
              }
            })
          }} />
        ))}
      </div>
      ))}
    </>
  );
};

export default AttributesFilterComponent;