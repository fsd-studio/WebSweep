import { useDataCollection } from "context/DataCollectionContext";

function HTMLValidationModule() {
    const { companyData } = useDataCollection();

  return (
    <>
        <p>
            {JSON.stringify(companyData)}
        </p>
    </>
  );
}

export default HTMLValidationModule;