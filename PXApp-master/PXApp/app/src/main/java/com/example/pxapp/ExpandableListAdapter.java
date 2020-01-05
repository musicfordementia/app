package com.example.pxapp;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.ExpandableListView;
import android.widget.ImageView;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;

public class ExpandableListAdapter extends BaseExpandableListAdapter {
    private Context ctx;
    private LinkedHashMap<Holder, ArrayList<String>> listGroup;

    public ExpandableListAdapter(Context ctx,
                                 LinkedHashMap<Holder, ArrayList<String>> listGroup)
    throws IllegalArgumentException {
        this.ctx = ctx;
        this.listGroup = listGroup;
        if (listGroup == null) throw new IllegalArgumentException("listGroup can not be null");
    }

    @Override
    public String getChild(int groupPos, int childPos) {
        if (!getGroup(groupPos).hasChildren) return null;

        Holder group = getGroup(groupPos);
        if (group == null) return null;

        ArrayList<String> children = listGroup.get(group);
        if (childPos < 0 || childPos > children.size())
            return null;

        return children.get(childPos);
    }

    @Override
    public long getChildId(int groupPos, int childPos) {
        return childPos;
    }

    @Override
    public View getChildView(int groupPos, int childPos, boolean isLastChild,
                             View convertView, ViewGroup parent) {
        if (convertView == null) {
            LayoutInflater inflater = (LayoutInflater)ctx.getSystemService(
                    Context.LAYOUT_INFLATER_SERVICE);
            convertView = inflater.inflate(R.layout.list_child, null);
        }

        Holder holder = getGroup(groupPos);
        if (holder != null && holder.hasChildren) {
            TextView txtChild = convertView.findViewById(R.id.txtChild);
            txtChild.setText(getChild(groupPos, childPos));
        }

        return convertView;
    }

    @Override
    public int getChildrenCount(int groupPos) {
        if (!getGroup(groupPos).hasChildren) return 0;

        Holder group = getGroup(groupPos);
        if (group == null) return 0;

        return listGroup.get(group).size();
    }

    @Override
    public Holder getGroup(int groupPos) {
        for (Map.Entry<Holder, ArrayList<String>> e : listGroup.entrySet()) {
            if (groupPos == 0) return e.getKey();
            groupPos--;
        }

        return null;
    }

    @Override
    public int getGroupCount() {
        return listGroup.size();
    }

    @Override
    public long getGroupId(int groupPos) {
        return groupPos;
    }

    @Override
    public View getGroupView(final int groupPos, final boolean isExpanded, View convertView,
                             final ViewGroup parent) {
        if (convertView == null) {
            LayoutInflater inflater = (LayoutInflater)ctx.getSystemService(
                    Context.LAYOUT_INFLATER_SERVICE);
            convertView = inflater.inflate(R.layout.list_group, null);
        }

        Holder holder = getGroup(groupPos);
        if (holder == null) return convertView;
        ImageView imgIcon = convertView.findViewById(R.id.imgIcon);
        if (holder.imgIcon != 0) imgIcon.setImageResource(holder.imgIcon);
        else imgIcon.setVisibility(View.GONE);
        TextView txtHeader = convertView.findViewById(R.id.txtHeader);
        txtHeader.setText(holder.txtHeader);
        final ImageView imgArrow = convertView.findViewById(R.id.imgArrow);
        if (holder.hasChildren) {
            imgArrow.setImageResource(isExpanded ? R.drawable.ic_arrow_up :
                                                   R.drawable.ic_arrow_down);

            imgArrow.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    ExpandableListView exp = (ExpandableListView)parent;
                    if (isExpanded) exp.collapseGroup(groupPos);
                    else exp.expandGroup(groupPos, true);
                }
            });
        }
        else imgArrow.setVisibility(View.GONE);

        return convertView;
    }

    @Override
    public boolean hasStableIds() {
        return false;
    }

    @Override
    public boolean isChildSelectable(int groupPos, int childPos) {
        return true;
    }

    public static class Holder {
        public int imgIcon;
        public String txtHeader;
        public boolean hasChildren;

        public Holder(String txtHeader, boolean hasChildren) {
            imgIcon = 0;
            this.txtHeader = txtHeader;
            this.hasChildren = hasChildren;
        }

        public Holder(int imgIcon, String txtHeader, boolean hasChildren) {
            this.imgIcon = imgIcon;
            this.txtHeader = txtHeader;
            this.hasChildren = hasChildren;
        }
    }
}

