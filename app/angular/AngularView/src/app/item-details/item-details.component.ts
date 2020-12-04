import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemsService } from '../model-service/items/items.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {

  item: any;

  itemForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ItemDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public itemData: any,
    private formBuilder: FormBuilder,
    private itemsService: ItemsService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.item = this.itemData.item;

    this.itemForm = this.formBuilder.group({
      name: [this.item ? this.item.name : '', Validators.required],
      category: [this.item ? this.item.category : '', Validators.required],
      quantity: [this.item ? this.item.quantity : '', Validators.required],
      deposit: [this.item ? this.item.deposit : '', Validators.required],
      item_status: [this.item ? this.item.item_status : '', Validators.required],
      remarks: [this.item ? this.item.remarks : '', '']
    });
  }

  getDialogTitle() {
    if (this.itemData.mode === 'create') {
      return 'Create Item';
    } else if (this.itemData.mode === 'edit') {
      return 'Edit Item';
    }
  }

  onSubmit() {
    this.dialogRef.close();
    const data = this.itemForm.value;
    if (data.remarks.length === 0) {
      data.remarks = 'N/A';
    }
    if (this.itemData.mode === 'create') {
      this.itemsService.createItem(data).subscribe();
      this.snackbar.open('New item created', 'OK', { duration: 5000 });
    } else if (this.itemData.mode === 'edit') {
      this.itemsService.updateItem(this.itemData.item.id, data).subscribe();
      this.snackbar.open('Item ' + this.itemData.item.id + ' edited', 'OK', { duration: 5000 });
    }
  }
}
