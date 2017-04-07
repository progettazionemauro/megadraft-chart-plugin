/*
 * Copyright (c) 2016, Globo.com <http://store.backstage.globoi.com/project/jornalismo/chart>
 *
 * License: MIT
 */

import React, {Component} from "react";


export default class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modelLineChart: this.props.modelLineChart,
      modelColumnChart: this.props.modelColumnChart,
      modelPieChart: this.props.modelPieChart,
      serieKey: 0
    };

    this.serieKeyInterval = 100;
  }

  _getChartType() {
    let chartType = {
      line: {
        model: this.props.modelLineChart,
        render: this._renderLineForm,
        change: this._onChangeLine
      },
      column: {
        model: this.props.modelColumnChart,
        render: this._renderColumnForm,
        change: this._onChangeColumn
      },
      pie: {
        model: this.props.modelPieChart,
        render: this._renderPieForm,
        change: this._onChangePie
      }
    };

    return chartType[this.props.chartType];
  }

  _currentModel = () => {
    return this._getChartType().model;
  }

  _currentRender = () => {
    return this._getChartType().render;
  }

  _currentChange = () => {
    return this._getChartType().change;
  }

  _onChangeLine = (key, value) => {
    let newModelLine = Object.assign({}, this.props.modelLineChart, {[key]: value});
    let serieKey = key.split('-');

    if (key === 'pointSize') {
      this._changePoints(parseInt(value));
    }

    if (serieKey[0].indexOf("serieName") === 0) {
      let newSeries = this.props.modelLineChart.series;
      newSeries[parseInt(serieKey[1])].name = value;
      newModelLine = Object.assign({}, this.props.modelLineChart, {series: newSeries});
    }

    if (serieKey[0].indexOf("seriePoint") === 0) {
      let newSeries = this.props.modelLineChart.series;
      newSeries[parseInt(serieKey[1])].data[parseInt(serieKey[2])] = parseFloat(value);
      newModelLine = Object.assign({}, this.props.modelLineChart, {series: newSeries});
    }

    this.props.setStatePopin({
      modelLineChart: newModelLine
    });
  }

  _onChangeColumn = (key, value) => {
    let newModelColumn = Object.assign({}, this.props.modelColumnChart, {[key]: value});
    let serieKey = key.split('-');

    if (serieKey[0].indexOf("serieName") === 0) {
      let newSeries = this.props.modelColumnChart.data;
      newSeries[parseInt(serieKey[1])][0] = value;
      newModelColumn = Object.assign({}, this.props.modelColumnChart, {data: newSeries});
    }

    if (serieKey[0].indexOf("seriePoint") === 0) {
      let newSeries = this.props.modelColumnChart.data;
      newSeries[parseInt(serieKey[1])][1] = parseFloat(value);
      newModelColumn = Object.assign({}, this.props.modelColumnChart, {data: newSeries});
    }

    this.props.setStatePopin({
      modelColumnChart: newModelColumn
    });
  }

  _onChangePie = (key, value) => {
    let newModelPie = Object.assign({}, this.props.modelPieChart, {[key]: value});
    let serieKey = key.split('-');

    if (serieKey[0].indexOf("serieName") === 0) {
      let newSeries = this.props.modelPieChart.data;
      newSeries[parseInt(serieKey[1])].name = value;
      newModelPie = Object.assign({}, this.props.modelPieChart, {data: newSeries});
    }

    if (serieKey[0].indexOf("seriePoint") === 0) {
      let newSeries = this.props.modelPieChart.data;
      newSeries[parseInt(serieKey[1])].y = parseFloat(value);
      newModelPie = Object.assign({}, this.props.modelPieChart, {data: newSeries});
    }

    this.props.setStatePopin({
      modelPieChart: newModelPie
    });
  }

  _changePoints = (newPointSize) => {
    let newModelChart = this._currentModel();

    let oldPointSize = newModelChart.pointSize;
    let series = newModelChart.series;

    let removePoint = (pointSize) => {
      for (let i=0;i < series.length; i++) {
        series[i].data = series[i].data.slice(0, pointSize);
      }

      newModelChart.pointSize = pointSize;
    }

    let addPoint = (pointSize) => {
      for (let i=0;i < series.length; i++) {
        series[i].data = series[i].data.concat(new Array(pointSize - oldPointSize).fill(null));
      }
    }

    if (oldPointSize > newPointSize) {
      removePoint(newPointSize);
    } else {
      addPoint(newPointSize);
    }

    this.props.setStatePopin({
      modelLineChart: newModelChart
    });
  }

  _handlePointLineAdd = () => {
    let newData = [];
    let serieKey = this.state.serieKey + this.serieKeyInterval;
    let newSeries;
    let newModelLine;

    for (let i=0; i < this.props.modelLineChart.pointSize; i++) {
      newData.push(null);
    }

    newSeries = this.props.modelLineChart.series.concat([{name: "", data: newData}]);
    newModelLine = Object.assign({}, this.props.modelLineChart, {series: newSeries});

    this.setState({
      serieKey: serieKey
    });

    this.props.setStatePopin({
      modelLineChart: newModelLine
    });
  }

  _handlePointColumnAdd = () => {
    let newSeries = this.props.modelColumnChart.data.concat([[null, null]]);
    let newModelColumn = Object.assign({}, this.props.modelColumnChart, {data: newSeries});
    let serieKey = this.state.serieKey + this.serieKeyInterval;

    this.setState({
      serieKey: serieKey
    });

    this.props.setStatePopin({
      modelColumnChart: newModelColumn
    });
  }

  _handlePointPieAdd = () => {
    let newSeries = this.props.modelPieChart.data.concat([{name: "", y: null}]);
    let newModelPie = Object.assign({}, this.props.modelPieChart, {data: newSeries});
    let serieKey = this.state.serieKey + this.serieKeyInterval;

    this.setState({
      serieKey: serieKey
    });

    this.props.setStatePopin({
      modelPieChart: newModelPie
    });
  }

  _handlePointLineRemove = (index) => {
    let newSeries = this.props.modelLineChart.series;
    let serieKey = this.state.serieKey - this.serieKeyInterval;
    let newModelLine;

    newSeries.splice(index, 1);
    newModelLine = Object.assign({}, this.props.modelLineChart, {series: newSeries});

    this.setState({
      serieKey: serieKey
    });

    this.props.setStatePopin({
      modelLineChart: newModelLine
    });
  }

  _handlePointColumnRemove = (index) => {
    let newSeries = this.props.modelColumnChart.data;
    let serieKey = this.state.serieKey - this.serieKeyInterval;

    newSeries.splice(index, 1);
    let newModelColumn = Object.assign({}, this.props.modelColumnChart, {data: newSeries});

    this.setState({
      serieKey: serieKey
    });

    this.props.setStatePopin({
      modelColumnChart: newModelColumn
    });
  }

  _handlePointPieRemove = (index) => {
    let newSeries = this.props.modelPieChart.data
    let serieKey = this.state.serieKey - this.serieKeyInterval;

    newSeries.splice(index, 1);
    let newModelPie = Object.assign({}, this.props.modelPieChart, {data: newSeries});

    this.setState({
      serieKey: serieKey
    });

    this.props.setStatePopin({
      modelPieChart: newModelPie
    });
  }

  _onChange = (e) => {
    let key = e.target.attributes.name.nodeValue;
    let value = e.target.value;
    let change = this._currentChange();

    change(key, value);
  }

  _renderCommonForm = () => {
    let model = this._currentModel();

    return (
      <div>
        <div className="group">
          <label>Título</label>
          <input
            type="text"
            name="title"
            onChange={this._onChange}
            defaultValue={model.title} />
        </div>
        <div className="group">
          <label>Subtítulo</label>
          <input
            type="text"
            name="subtitle"
            onChange={this._onChange}
            defaultValue={model.subtitle} />
        </div>
      </div>
    );
  }

  _renderLineFormPoints = () => {
    let series = this.props.modelLineChart.series || [];
    let key = this.state.serieKey;

    return series.map(function(serie, index) {
      key++;
      return (
        <div key={"points-" + key} className="points clear">
          <button
            className="btn"
            onClick={() => this._handlePointLineRemove(index)}>remover</button>
          <input
            key={"name-" + index}
            type="text"
            name={"serieName-" + index}
            className="points-name"
            placeholder="Legenda"
            onChange={this._onChange}
            defaultValue={serie.name} />
          <div>
          {serie.data.map(function(data, indexPoint) {
            return <input
              key={"point-" + index + "-" + indexPoint}
              type="text"
              name={"seriePoint-" + index + "-" + indexPoint}
              className="point"
              placeholder="Marcador"
              onChange={this._onChange}
              defaultValue={data} />;
          }, this, index)}
          </div>
        </div>
      );
    }, this)
  }

  _renderColumnFormPoints = () => {
    let series = this.props.modelColumnChart.data || [];
    let key = this.state.serieKey;

    return series.map(function(serie, index) {
      key++;
      return (
        <div key={"points-" + key} className="points clear">
          <button
            className="btn"
            onClick={() => this._handlePointColumnRemove(index)}>remover</button>
          <input
            type="text"
            name={"serieName-" + index}
            className="points-name"
            placeholder="Legenda"
            onChange={this._onChange}
            defaultValue={serie[0]} />
          <div>
            <input
              type="text"
              name={"seriePoint-" + index}
              className="point"
              placeholder="Marcador"
              onChange={this._onChange}
              defaultValue={serie[1]} />
          </div>
        </div>
      );
    }, this)
  }

  _renderPieFormPoints = () => {
    let series = this.props.modelPieChart.data || [];
    let key = this.state.serieKey;

    return series.map(function(serie, index) {
      key++;
      return (
        <div key={"points-" + key} className="points clear">
          <button
            className="btn"
            onClick={() => this._handlePointPieRemove(index)}>remover</button>
          <input
            type="text"
            name={"serieName-" + index}
            className="points-name"
            placeholder="Legenda"
            onChange={this._onChange}
            defaultValue={serie.name} />
          <div>
            <input
              type="text"
              name={"seriePoint-" + index}
              className="point"
              placeholder="Marcador"
              onChange={this._onChange}
              defaultValue={serie.y} />
          </div>
        </div>
      );
    }, this)
  }

  _renderLineForm = () => {
    let model = this.props.modelLineChart;

    return (
      <div>
        {this._renderCommonForm()}
        <div className="group">
          <label>Legenda Eixo Y</label>
          <input
            type="text"
            name="yAxisTitle"
            onChange={this._onChange}
            value={model.yAxisTitle} />
        </div>
        <div className="point-start group">
          <label>Ponto Inicial</label>
          <input
            type="text"
            name="pointStart"
            onChange={this._onChange}
            value={model.pointStart} />
        </div>
        <div className="point-size group">
          <label>Número de marcadores</label>
          <select
            name="pointSize"
            onChange={this._onChange}
            value={model.pointSize}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
        <div className="clear group">
          <label>Séries</label>
          {this._renderLineFormPoints()}
          <div className="new-point clear">
            <button
              className="btn"
              onClick={() => this._handlePointLineAdd()}>nova série</button>
          </div>
        </div>
      </div>
    );
  }

  _renderColumnForm = () => {
    let model = this.props.modelColumnChart;

    return (
      <div>
        {this._renderCommonForm()}
        <div className="group">
          <label>Legenda Eixo Y</label>
          <input
            type="text"
            name="yAxisTitle"
            onChange={this._onChange}
            defaultValue={model.yAxisTitle} />
        </div>
        <div className="group">
          <label>Nome da Série</label>
          <input
            type="text"
            name="nameColumn"
            onChange={this._onChange}
            value={model.nameColumn} />
        </div>
        <div className="clear group">
          <label>Séries</label>
          {this._renderColumnFormPoints()}
          <div className="new-point clear">
            <button
              className="btn"
              onClick={() => this._handlePointColumnAdd()}>nova série</button>
          </div>
        </div>
      </div>
    );
  }

  _renderPieForm = () => {
    let model = this.props.modelPieChart;

    return (
      <div>
        <div>
          {this._renderCommonForm()}
        </div>
        <div className="group">
          <label>Nome da Série</label>
          <input
            type="text"
            name="namePie"
            onChange={this._onChange}
            value={model.namePie} />
        </div>
        <div className="clear group">
          <label>Séries</label>
          {this._renderPieFormPoints()}
          <div className="new-point clear">
            <button
              className="btn"
              onClick={() => this._handlePointPieAdd()}>nova série</button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    let render = this._currentRender();
    return render();
  }
}
