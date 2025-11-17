import { LightningElement, api, wire } from 'lwc';
import getOpportunityProduct from '@salesforce/apex/showOpportunityProductController.getOpportunityProduct';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';
import getUsersProfiles from '@salesforce/apex/profilesController.getUsersProfiles';
import Product_Name from '@salesforce/label/c.Product_Name';
import Quantity_Label from '@salesforce/label/c.Quantity_Label';
import Unit_Price_Label from '@salesforce/label/c.Unit_Price_Label';
import Total_Price_Label from '@salesforce/label/c.Total_Price_Label';
import Quantity_in_stock_label from '@salesforce/label/c.Quantity_in_stock_label';
import Delete_Label from '@salesforce/label/c.Delete_Label';
import See_product_Label from '@salesforce/label/c.See_product_Label';
import has_Quantity_Error_Label from '@salesforce/label/c.has_Quantity_Error_Label';
import 	Opportunity_products_Label from '@salesforce/label/c.Opportunity_products_Label';
import Any_product_lines_label from '@salesforce/label/c.Any_product_lines_label';

export default class ShowOpportunityProduct extends NavigationMixin(LightningElement) {

    labels = {
        quantityError : has_Quantity_Error_Label,
        OpportunityproductsLabel : Opportunity_products_Label,
        AnyProductLinesLabel : Any_product_lines_label,  
        };
    
    @api recordId;
    products;
    error;
    hasNoproducts = false;
    wireResult; // utilisé pour refreshApex
    hasQuantityError = false;

    columns = [
        { label: Product_Name, fieldName: 'ProductName', type: 'text' },
        { label: Quantity_Label, fieldName: 'Quantity', type: 'number', cellAttributes: { alignment: 'left',
            class: { fieldName: 'quantityColor'}
         }},

        { label: Unit_Price_Label, fieldName: 'UnitPrice', type: 'currency' },
        { label: Total_Price_Label, fieldName: 'TotalPrice', type: 'currency' },
        { label: Quantity_in_stock_label, fieldName: 'QuantityInStock', type: 'number'},
        {
            type: 'button-icon',
            label: Delete_Label, // texte affiché dans la cellule
            typeAttributes: {
                name: 'Delete',
                title: Delete_Label,
                iconName: 'utility:delete',
                variant: 'destructive-text'
        
            }
        },
        {
          
            type: 'button',
            label: See_product_Label,
            typeAttributes: {
                label: See_product_Label,
                name: 'View',
                title: See_product_Label,
                iconName: 'utility:preview', // Icône "œil"
                iconPosition: 'left',
                variant: 'brand' 
            }
        }

        
    ];

    // Récupération des produits liés à l'opportunité
    @wire(getOpportunityProduct, { OpportunityId: '$recordId' })
    wiredProducts(result) {
        this.wireResult = result; // nécessaire pour refreshApex
        const { error, data } = result;
        if (data) {
            this.products = data.map(item => {
                return {
                    ...item,
                    ProductName: item.Product2.Name,
                    QuantityInStock: item.Product2.QuantityInStock__c,
                    quantityColor: item.Quantity > item.Product2.QuantityInStock__c ? "slds-text-color_error slds-text-title_bold slds-theme_shade slds-theme_alert-texture" : "slds-text-color_success"
                   
                };
            });
             this.hasQuantityError = this.products.some(
                item => item.Quantity > item.QuantityInStock
            );
            this.hasNoproducts = this.products.length === 0;
            this.error = undefined;
            
        } else if (error) {
            this.error = error;
            this.products = undefined;
            this.hasQuantityError = false;
        }
    }

    //  Appelé quand on clique sur une action dans le datatable
    callRowAction(event) {
        const recId = event.detail.row.Id;  // Recupère Id de l’OpportunityLineItem
        const actionName = event.detail.action.name;

        console.log('Action cliquée:', actionName, ' sur recordId:', recId);

        if (actionName === 'Delete') {
            this.handleDeleteRow(recId, 'Delete');
        } else if (actionName === 'View') {
            this.handleViewProduct(event.detail.row.Product2Id);
        }
    }

    // Voir la fiche du produit (Product2)
    handleViewProduct(productId) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: productId,
                objectApiName: 'Product2',
                actionName: 'view'
            }
        });
    }

    //  Supprimer une ligne produit (OpportunityLineItem)
    handleDeleteRow(recordIdToDelete) {
        deleteRecord(recordIdToDelete)
            .then(() => {
                this.showToast('Succès', 'Produit supprimé avec succès', 'success', 'dismissable');
                return refreshApex(this.wireResult);
            })
            .catch(error => {
                this.showToast('Erreur', 'Impossible de supprimer le produit', 'error', 'sticky');
                console.error(error);
            });
    }

    //  Message utilisateur
    showToast(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }
    connectedCallback() {
        getUsersProfiles()
        .then(result => {
            console.log('Profile utilisateur : ' + result);
            if(result === 'Commercial') {
                this.columns = this.columns.filter(col => col.name !== See_product_Label);
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération du profil utilisateur : ' + error);
        });
    } 
}


