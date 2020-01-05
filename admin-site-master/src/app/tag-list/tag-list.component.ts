import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api.service';
import { Tag } from '../tag';
import { MessageMap } from '../messagemap';

declare var $: any;

@Component({
    selector: 'app-tag-list',
    templateUrl: './tag-list.component.html',
    styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {
    error = '';
    newTag = new Tag();
    allTags: Tag[] =  [];
    editingTags: Tag[] = [];
    messageMap = new MessageMap();
    tagsDT: any;
    success = false;
    message = '';
    isAddingTag = false;
    // The user can edit more than 1 tag at once, so we need to track which tag the user clicked the
    // save button on.
    isSavingMap = [];

    constructor(private api: ApiService, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.initTags();
    }

    initTags() {
        this.api.getAllTags().subscribe(
            res => { 
                this.allTags = res;
                this.cdr.detectChanges();
                this.createTagsDT();

                this.isSavingMap = this.allTags.map(t => {
                    return {
                        id: t.id,
                        isSaving: false
                    }
                });
            },
            err => { this.error = this.parseError(err); }
        );
    }

    edit(tag: Tag) {
        let editing = this.editingTags.find(e => e.id == tag.id);
        if (editing) editing.name = tag.name;
        else this.editingTags.push(JSON.parse(JSON.stringify(tag)));

        // Have to do this, otherwise the selected tag will jump to the top of the table.
        this.recreateTagsDT();
    }

    getSelectedTag(id: number): Tag {
        return this.editingTags.find(t => t.id == id);
    }

    save(selTag: Tag) {
        this.setIsSaving(selTag.id, true);
        this.api.updateTag(selTag).subscribe(
            res => {
                let success: boolean = res.success;
                if (success) {
                    // Update the model.
                    let tag = this.allTags.find(e => e.id == selTag.id);
                    tag.name = selTag.name;
                }
                this.messageMap.push(selTag.id, res.message, success);
                this.cancel(selTag.id);
                this.setIsSaving(selTag.id, false);
            },
            err => {
                this.messageMap.push(selTag.id, this.parseError(err), false);
                this.setIsSaving(selTag.id, false);
			}
        );
    }

    cancel(id: number) {
        let index = this.editingTags.findIndex(e => e.id == id);
        if (index != -1) this.editingTags.splice(index, 1);

        this.recreateTagsDT();
    }

    addTag() {
        this.isAddingTag = true;
        this.api.addTag(this.newTag).subscribe(
            res => {
                this.success = res.success;
                this.message = res.message;

                if (this.success) this.reloadTagsDT();

                this.isAddingTag = false;
            },
            err => { 
                this.success = false;
                this.message = this.parseError(err);
                this.isAddingTag = false;
            }
        )
    }

    clearTag() {
        this.newTag.id = 0;
        this.newTag.name = '';
    }

    createTagsDT() {
        let isEditing = this.editingTags.length > 0;
        this.tagsDT = $('#tags').DataTable({
            pageLength: 25,
            columnDefs: [
                {
                    targets: isEditing ? '_all' : 2,
                    searchable: false,
                    orderable: false
                },
                {
                    targets: [0],
                    visible: false
                }
            ]
        });
    }

    reloadTagsDT() {
        this.tagsDT.destroy();
        this.initTags();
    }

    recreateTagsDT() {
        this.tagsDT.destroy();
        this.cdr.detectChanges();
        this.createTagsDT();
    }

    getIsSaving(id: number): boolean {
        let elem = this.isSavingMap.find(e => e.id == id);
        return elem ? elem.isSaving : false;
    }

    setIsSaving(id: number, isSaving: boolean) {
        let elem = this.isSavingMap.find(e => e.id == id);
        if (elem) elem.isSaving = isSaving;
    }

    parseError(e): string {
        if (!e) return 'Something went wrong';
        if (e.error && e.error.message) return e.error.message;
        if (e.message) return e.message;
        return e;
    }
}
