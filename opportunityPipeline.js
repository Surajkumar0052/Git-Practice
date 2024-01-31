import { LightningElement, api, track } from 'lwc';
import getPipelineData from '@salesforce/apex/OpportunityPipelineController.getPipelineData';
import processPipelineRecords from '@salesforce/apex/OpportunityPipelineController.processPipelineRecords';

export default class OpportunityPipeline extends LightningElement {
    @api recordId;
    @track pipelineData;
    @track pipelineDataToOperate = [];
    @track updatedData;
    showPipeLineTable = true;

    connectedCallback() {
        this.getforecasts();
    }

    getforecasts() {
        getPipelineData({ opportunityId: this.recordId, opportunityId: this.recordId })
            .then(result => {
                console.log('OpportunityPipeline pipelineData : ', result);
                this.pipelineData = result;
                console.log('OpportunityPipeline this.pipelineData : ', JSON.stringify(this.pipelineData));
                setTimeout(() => {
                    this.fillRecordIndex();
                }, 1000);
            })
            .catch(error => {
                // TODO Error handling
                console.log('OpportunityPipeline pipelineData error : ', error);
            });
    }

    handleChange(event) {
        try {

            console.log('OpportunityPipeline Input val : ' + event.target.value + ' name : ', event.currentTarget.dataset.fieldname + ' recs : ', JSON.stringify(this.pipelineDataToOperate));

            const existingRecordIndex = this.pipelineDataToOperate.findIndex(record => record.Location === event.currentTarget.dataset.id);
            console.log('OpportunityPipeline existingRecordIndex : ', existingRecordIndex);

            this.pipelineData = this.pipelineData.map(item => {
                if (item.Location === event.currentTarget.dataset.id) {
                    item[event.currentTarget.dataset.fieldname] = event.target.value;
                    if (existingRecordIndex === -1) {
                        this.pipelineDataToOperate.push(item);
                        console.log('OpportunityPipeline pipelineDataToOperate after pushing rec : ', JSON.stringify(this.pipelineDataToOperate));

                    }
                    else {
                        this.pipelineDataToOperate[existingRecordIndex][event.currentTarget.dataset.fieldname] = event.target.value;
                        console.log('OpportunityPipeline pipelineDataToOperate after changing input val : ', JSON.stringify(this.pipelineDataToOperate));

                    }
                }
                return item;
            });
            console.log('OpportunityPipeline newPipelineData : ', JSON.stringify(this.pipelineData));
            console.log('OpportunityPipeline pipelineDataToOperate final ', JSON.stringify(this.pipelineDataToOperate));
        } catch (error) {
            console.log('OpportunityPipeline handleNext Error : ', error);
        }

    }

    handleNextButtonClick(event) {
        console.log('OpportunityPipeline this.pipelineDataToOperate to send ', JSON.stringify(this.pipelineDataToOperate));
        console.log('OpportunityPipeline this.pipelineDataToOperate.size() ', this.pipelineDataToOperate.length);
        let dataToSend;
        if (this.pipelineDataToOperate.length > 0) {
            dataToSend = this.pipelineDataToOperate.length;
        }
        else {
            dataToSend = null;
            console.log('OpportunityPipeline no action needed');
        }

        processPipelineRecords({ pipelineRecords: dataToSend, opportunityId: this.recordId })
            .then(result => {
                    this.showPipeLineTable = false;
                    console.log('OpportunityPipeline Records updated successfully:', result);
                    this.updatedData = result;
                    console.log('OpportunityPipeline updatedData:', this.updatedData);
                    this.pipelineDataToOperate = [];
                })
                .catch(error => {
                    console.error('OpportunityPipeline Error updating records:', error);
                });
    }

    fillRecordIndex() {
        var index = 1;
        this.template.querySelectorAll('.pipelineIndex').forEach(element => {
            element.innerHTML = index;
            index += 1;

        });
    }

}