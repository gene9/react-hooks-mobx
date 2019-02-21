import "@babel/polyfill";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { hot, setConfig } from "react-hot-loader";
import { Formik, FormikActions, FormikProps, Form, Field, FieldProps } from "formik";
import { Observer, useObservable } from "mobx-react-lite";
import { observable } from "mobx";

class SampleModel {
  @observable siteName: string;

  constructor(siteName: string = "") {
    this.siteName = siteName;
  }
}

class SampleService {
  async save(model: SampleModel): Promise<SampleModel> {
    return model;
  }
}

class SampleStore {
  @observable model = new SampleModel();
}

const StoreContext = React.createContext(new SampleStore());

const Top = ({ service }) => {
  const store = React.useContext(StoreContext);

  return (
    <Observer>
      {() => (
        <>
          <Formik
            initialValues={{
              siteName: store.model.siteName
            }}
            onSubmit={({ siteName }, actions) => {
              const newModel = new SampleModel(siteName);
              service.save(newModel).then(data => {
                store.model = data;
              });
            }}
            render={({ isSubmitting }) => {
              return (
                <Form>
                  <Field name="siteName" autoFocus={true} placeholder="Site name" />

                  <button type="submit" disabled={isSubmitting}>
                    Submit
                  </button>
                </Form>
              );
            }}
          />

          <div>{JSON.stringify(store.model)}</div>
        </>
      )}
    </Observer>
  );
};

const service = new SampleService();

setConfig({ logLevel: "debug" });

hot(module)(Top);
ReactDOM.render(<Top service={service} />, document.getElementById("root"));

// ---
