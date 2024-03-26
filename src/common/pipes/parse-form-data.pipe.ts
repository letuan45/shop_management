import { Injectable, PipeTransform } from '@nestjs/common';

type TParseFormDataJsonOptions = {
  field: string;
};

@Injectable()
export class ParseFormDataJsonPipe implements PipeTransform {
  constructor(private options?: TParseFormDataJsonOptions) {}

  transform(value: any) {
    const { field } = this.options;
    const jsonField = value[field].replace(
      /(\w+:)|(\w+ :)/g,
      function (matchedStr: string) {
        return '"' + matchedStr.substring(0, matchedStr.length - 1) + '":';
      },
    );
    console.log('test');
    return JSON.parse(jsonField);
  }
}
