import "@babel/polyfill";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { hot, setConfig } from "react-hot-loader";
import { Formik, FormikActions, FormikProps, Form, Field, FieldProps } from "formik";
import { Observer, useObservable } from "mobx-react-lite";
import * as mobx from 'mobx';
import * as Yup from "yup";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';

mobx.configure({ enforceActions: 'observed' });

library.add(faCircleNotch);

const SampleSchema = Yup.object().shape({
  siteName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required")
});

class SampleModel {
  @mobx.observable siteName: string;

  constructor(siteName: string = "") {
    this.siteName = siteName;
  }
}

class SampleService {
  async save(model: SampleModel): Promise<SampleModel> {
    await this.sleep(3000);
    return model;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class SampleStore {
  @mobx.observable inProgress = false;
  @mobx.observable model = new SampleModel();

  @mobx.action setInProgress(val) {
    this.inProgress = val;
  }

  @mobx.action updateModel(val) {
    this.model = val;
  }
}

const StoreContext = React.createContext(new SampleStore());

const Top = ({ service }) => {
  const store = React.useContext(StoreContext);

  return (
    <Observer>
      {() => (
        <>
          <Formik
            validationSchema={SampleSchema}
            initialValues={{
              siteName: store.model.siteName
            }}
            onSubmit={async ({ siteName }, actions) => {
              store.setInProgress(true);

              const newModel = new SampleModel(siteName);
              service.save(newModel).then(data => {
                store.updateModel(data);
                store.setInProgress(false);
                actions.setSubmitting(false);
              }).catch((err) => {
                store.setInProgress(false);
                actions.setSubmitting(false);
              });
            }}
            render={({ isSubmitting, errors, touched }) => {
              return (
                <Form>
                  {store.inProgress && <FontAwesomeIcon icon="circle-notch" spin />}
                  <Field name="siteName" autoFocus={true} placeholder="Site name" maxLength={50} />

                  {errors.siteName && touched.siteName && <div>{errors.siteName}</div>}

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
